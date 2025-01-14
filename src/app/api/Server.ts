class Server {
    public url: string;
  
    constructor( ) { 

      const next_env = process.env.NODE_ENV; 

      const urls = {
        local: 'http://127.0.0.1:5000',
        // server: 'https://flask-app-614461425863.asia-east1.run.app'
        server: 'http://0.0.0.0:8000'
      };  

      this.url = next_env === 'production' ? urls.server : urls.local;
      // this.url = next_env === 'production' ? urls.local : urls.local; 
    }
  }
  
  export default Server;
  