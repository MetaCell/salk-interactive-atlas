import { Configuration } from '../apiclient/workspaces/configuration';
import { ApiApi } from '../apiclient/workspaces/api';

const workspacesApiUri = '/proxy/workspaces';

class WorkspaceService {

  workspacesApi: ApiApi = null;
  accessToken: string = null;

  constructor() {
    this.initApis(null);
  }

  initApis = (token: string) => {
    this.accessToken = token;
    this.workspacesApi = new ApiApi(new Configuration({ basePath: workspacesApiUri, accessToken: token }));
  }

  getApi = (): ApiApi => {
      return this.workspacesApi;
  }
}

export default new WorkspaceService();
