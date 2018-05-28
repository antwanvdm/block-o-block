import config from './config.json';

export default class DataService {
    private endPointList: string = `/databases/${config.dataService.databaseName}/collections/${config.dataService.collectionName}?apiKey=${config.dataService.apiKey}`;
    private endPointSave: string = `/databases/${config.dataService.databaseName}/collections/${config.dataService.collectionName}?apiKey=${config.dataService.apiKey}`;

    /**
     * Store the latest score in the DB
     *
     * @param score
     * @returns {Promise<{}>}
     */
    public saveScore(score: number) {
        if (config.functionalities.dataService === false) {
            return this.disabled();
        }

        let url = `${config.dataService.baseUrl}${this.endPointSave}`;
        return fetch(url, {
            body: JSON.stringify({
                score: score
            }),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            mode: 'cors'
        }).then(response => response.json());
    }

    /**
     * Get all the current scores from the DB
     *
     * @returns {Promise<[]>}
     */
    public getScores() {
        if (config.functionalities.dataService === false) {
            return this.disabled();
        }

        let url = `${config.dataService.baseUrl}${this.endPointList}`;
        return fetch(url, {
            mode: 'cors'
        }).then(response => response.json());
    }

    /**
     * General message when this service is inactive
     *
     * @returns {Promise<{}>}
     */
    private disabled() {
        return new Promise((resolve) => {
            resolve({"error": "Dataservice is disabled"});
        });
    }
}
