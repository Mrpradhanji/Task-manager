const config = {
  apiUrl: import.meta.env.PROD 
    ? 'https://your-backend-url.com'  // Replace this with your actual backend URL when deploying
    : 'http://localhost:4000'
};

export default config; 