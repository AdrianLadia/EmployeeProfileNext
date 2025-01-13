class Server {
    public url: string;
  
    constructor( ) { 

      const next_env = process.env.NODE_ENV; 

      const urls = {
        local: 'http://127.0.0.1:5000',
        server: 'https://employee-profile-418261267315.asia-east1.run.app'
      };  

      this.url = next_env === 'production' ? urls.server : urls.local;
    }
  }
  
  export default Server;
  