const prod = {
    "MONGODB_URI_PROD": "mongodb://admin:password777@ds012578.mlab.com:12578/learning-genie"
};

process.env.MONGODB_URI = prod.MONGODB_URI_PROD;