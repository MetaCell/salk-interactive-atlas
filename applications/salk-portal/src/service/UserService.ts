import Keycloak from 'keycloak-js';
import { UserInfo } from '../types/user';
import { getBaseDomain } from '../utils';
import workspaceService from './WorkspaceService';
const keycloak = Keycloak('/keycloak.json');

declare const window: any;

export const initApis = (token: string) => {
    document.cookie = `accessToken=${token};path=/;domain=${getBaseDomain()}`;
    workspaceService.initApis(token);
}

function mapKeycloakUser(userInfo: any, userDetails: any): UserInfo {
    return {
        id: userInfo.sub,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        email: userInfo.email,
        isAdmin: isUserAdmin(),
        username: userInfo.preferred_username || userInfo.given_name,
        avatarUrl: userDetails ? `/${userDetails.avatar}` : null,
        notificationMethod: userDetails ? userDetails.notification_method : null,
        notifyNews: userDetails ? userDetails.notify_on_news : null,
        notifyNewShare: userDetails ? userDetails.notify_on_new_share : null,
        notifyNewTeamInvite: userDetails ? userDetails.notify_on_new_team_invite : null,
        notifyCloneMyExperiment: userDetails ? userDetails.notify_on_clone_my_experiment : null
    }
}

export function isUserAdmin(): boolean {
    return keycloak.hasRealmRole('administrator');
}

export async function initUser(): Promise<UserInfo> {
    let user = null;

    try {
        let authorized;
        await keycloak.init({
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
        }).then(authenticated => authorized = authenticated).catch(() => console.error("Cannot connect to user authenticator."));

        initApis(keycloak.token);
        if (authorized) {
            const userInfo: any = await keycloak.loadUserInfo();
            const userDetails: any = await workspaceService.getApi().meUserDetail();
            user = mapKeycloakUser(userInfo, userDetails.data);
        }
    } catch (err) {
        errorCallback(err);
        return null;
    }

    const tokenUpdated = (refreshed: any) => {
        if (refreshed) {
            initApis(keycloak.token);
        } else {
            console.error('not refreshed ' + new Date());
        }
    }
    // set token refresh before 5 minutes
    keycloak.onTokenExpired = () => {
        keycloak.updateToken(60).then(tokenUpdated).catch(() => {
            console.error('Failed to refresh token ' + new Date());
        })
    }
    if (user) {
        keycloak.updateToken(-1).then(tokenUpdated).catch(() => {
            console.error('Failed to refresh token ' + new Date());
        });  // activate refresh token
    }

    return user;
}

export async function login(): Promise<UserInfo> {
    const userInfo: any = await keycloak.login();
    return mapKeycloakUser(userInfo, null);
}

export async function logout() {
    return keycloak.logout();
}

export async function register() {
    return keycloak.register();
}

const errorCallback = (error: any) => {
    initApis(null);
}