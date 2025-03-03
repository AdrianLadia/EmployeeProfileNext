class Server {
  public apiUrl: string;
  public downloadUrl: string;

  constructor() {
    const next_env = process.env.NODE_ENV || 'development';

    const urls = {
      localApi: 'http://127.0.0.1:5000',
      productionApi: 'https://employeeprofilepustanan-418261267315.asia-east1.run.app',
      localDownload: 'http://127.0.0.1:80',
      productionDownload: 'http://127.0.0.1:80'
    };

    this.apiUrl = next_env === 'production' ? urls.productionApi : urls.localApi;
    // this.apiUrl = next_env === 'production' ? urls.productionApi : urls.productionApi;
    this.downloadUrl = next_env === 'production' ? urls.productionDownload : urls.localDownload;
  }
}

export default Server;
