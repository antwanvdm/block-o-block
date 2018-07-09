import config from './config.json';
import WindowEventHandler from "./helpers/windoweventhandler";

export default class DataService {
    private static instance: DataService;

    private endPointList: string = `/databases/${config.mLab.databaseName}/collections/${config.mLab.collectionName}?apiKey=${config.mLab.apiKey}`;
    private endPointSave: string = `/databases/${config.mLab.databaseName}/collections/${config.mLab.collectionName}?apiKey=${config.mLab.apiKey}`;
    private offlineUserScores: { name: string, score: number }[] = [];

    private constructor() {
        WindowEventHandler.addEventListener('online.dataservice', () => this.saveOfflineScoresToMlab());

        //Make sure local storage is never empty to prevent error when data service is inactive
        if (localStorage.getItem('scores') === null) {
            localStorage.setItem('scores', JSON.stringify([]));
        }
    }

    /**
     * This class needs to work as SingleTon to prevent double data calls etc.
     *
     * @returns {DataService}
     */
    public static getInstance(): DataService {
        if (!DataService.instance) {
            DataService.instance = new DataService();
        }
        return DataService.instance;
    }

    /**
     * Store the latest score in the DB
     *
     * @param name
     * @param score
     * @returns {Promise<{}>}
     */
    public saveScore(name: string, score: number): Promise<any> {
        let userScore = {name, score};

        if (config.functionalities.mLab === false || window.navigator.onLine === false) {
            this.offlineUserScores.push(userScore);

            //Save to local storage
            let mergedScores = JSON.parse(localStorage.getItem('scores')).concat(this.offlineUserScores);
            localStorage.setItem('scores', JSON.stringify(mergedScores));

            //Return same kind of promise as when connection would be on
            return new Promise((resolve) => {
                resolve(userScore);
            });
        }

        let url = `${config.mLab.baseUrl}${this.endPointSave}`;
        return fetch(url, {
            body: JSON.stringify(userScore),
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
        if (config.functionalities.mLab === false || window.navigator.onLine === false) {
            return new Promise((resolve) => {
                resolve(JSON.parse(localStorage.getItem('scores')));
            });
        }

        let url = `${config.mLab.baseUrl}${this.endPointList}&s={"score": -1}&l=10`;
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
     * Save the score to mLab once back online
     */
    private saveOfflineScoresToMlab(): void {
        if (this.offlineUserScores.length > 0) {
            Promise.all(this.offlineUserScores.map((user) => this.saveScore(user.name, user.score))).then(() => {
                this.offlineUserScores = [];
            });
        }
    }
}
