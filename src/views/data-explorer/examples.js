import { faHandSparkles } from "@fortawesome/free-solid-svg-icons";
import { Workflow, Platform, Task, Operation} from "./entities";

const fastRegressionSpark = new Workflow();
fastRegressionSpark.platform = new Platform({id: 1, slug: faHandSparkles, name: 'Spark'});

const dataReader = new Operation();
const reader = new Task({operation: dataReader})

fastRegressionSpark.tasks = [
    
]
