
export interface UserInfo {
    isAdmin?: boolean;
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl:  string;
    notificationMethod: string;
    notifyNews: boolean;
    notifyNewShare: boolean;
    notifyNewTeamInvite: boolean;
    notifyCloneMyExperiment: boolean;
}
