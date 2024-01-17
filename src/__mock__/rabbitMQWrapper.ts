class MockRabbitMQWrapper {
    private _client?: any;
    private _connnection?:any;

    constructor() {
        this._client = () => {}
    }
    get client() {
        return this._client;
    }

    async connect() {

    }
    
    async close() {

    }
}

export const rabbitMQWrapper = new MockRabbitMQWrapper();