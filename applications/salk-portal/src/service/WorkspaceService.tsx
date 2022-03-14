import { Configuration } from '../apiclient/workspaces/configuration';
import { ApiApi } from '../apiclient/workspaces/api';

const workspacesApiUri = '/proxy/workspaces';

const PER_PAGE_DEFAULT = 10;

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

  getApi = () => {
      return this.workspacesApi;
  }
}

export default new WorkspaceService();
