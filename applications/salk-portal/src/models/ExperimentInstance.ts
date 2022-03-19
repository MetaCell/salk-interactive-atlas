import {Experiment, ExperimentOwner, ExperimentOwnerGroups, ExperimentCollaborators, ExperimentPopulations, ExperimentTags} from '../apiclient/workspaces/api'

export default class ExperimentInstance implements Experiment {
    id?: number;
    name: string;
    is_private?: boolean;
    description: string;
    date_created?: string;
    last_modified?: string;
    owner?: ExperimentOwner;
    teams?: Array<ExperimentOwnerGroups>;
    collaborators?: Array<ExperimentCollaborators>;
    populations?: Array<ExperimentPopulations>
    tags?: Array<ExperimentTags>

    constructor(name:string, description:string, tags:Array<ExperimentTags>){
        this.name = name;
        this.description =  description;
        this.tags = tags 
    }
}
