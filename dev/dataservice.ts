import config from './config.json';

export default class DataService {
    private endPointList: string = `/databases/${config.dataService.databaseName}/collections/${config.dataService.collectionName}?apiKey=${config.dataService.apiKey}`;
    private endPointSave: string = `/databases/${config.dataService.databaseName}/collections/${config.dataService.collectionName}?apiKey=${config.dataService.apiKey}`;
    private disabledMessage: string = 'Dataservice is disabled';

    /**
     * Store the latest score in the DB
     *
     * @param score
     * @returns {Promise<{}>}
     */
    public saveScore(score: number): Promise<any> {
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
    public getScores(): Promise<any> {
        if (config.functionalities.dataService === false) {
            return this.disabled();
        }

        if (window.navigator.onLine === false) {
            return new Promise((resolve) => {
                resolve(JSON.parse(localStorage.getItem('scores')));
            });
        }

        let url = `${config.dataService.baseUrl}${this.endPointList}&s={"score": -1}&l=10`;
        return fetch(url, {
            mode: 'cors'
        }).then(response => response.json()).then((data) => {
            if (localStorage.getItem('scores') === JSON.stringify(data)) {
                return JSON.parse(localStorage.getItem('scores'));
            } else {
                localStorage.setItem('scores', JSON.stringify(data));
                return data;
            }
        });
    }

    /**
     * General message when this service is inactive
     *
     * @returns {Promise<{}>}
     */
    private disabled(): Promise<any> {
        return new Promise((resolve) => {
            resolve({"error": this.disabledMessage});
        });
    }
}
