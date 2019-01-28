const prod = {
    "MONGODB_URI_PROD": "mongodb://developer:password777@ds149672.mlab.com:49672/learning-genie-dev"
};

process.env.MONGODB_URI = prod.MONGODB_URI_PROD;