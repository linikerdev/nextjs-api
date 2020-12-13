// api/user/index.js
import mongoose from "mongoose";
import UserSchema from "../../../data/models/User";
const connectToMongo = async () => {
    const connection = await mongoose.createConnection(
        "mongodb://localhost:27017/nextjs",
        {
            useNewUrlParser: true,
            bufferCommands: false,
            bufferMaxEntries: 0,
            useUnifiedTopology: true,
        }
    );
    const User = connection.model("User", UserSchema);
    return {
        connection,
        models: {
            User,
        },
    };
};
const apiHandler = (res, method, handlers) => {
    if (!Object.keys(handlers).includes(method)) {
        res.setHeader("Allow", Object.keys(handlers));
        res.status(405).end(`Method ${method} Not Allowed`);
    } else {
        handlers[method](res);
    }
};
const mongoMiddleware = (handler) => async (req, res) => {
    const { connection, models } = await connectToMongo();
    try {
        await handler(req, res, connection, models);
    } catch (e) {
        connection.close();
        res.status(500).json({ error: e.message || "something went wrong" });
    }
};
export default mongoMiddleware(async (req, res, connection, models) => {
    const {
        query: { name },
        method,
    } = req;
    apiHandler(res, method, {
        POST: (response) => {
            models.User.create({ name }, (error, user) => {
                if (error) {
                    connection.close();
                    response.status(500).json({ error });
                } else {
                    response.status(200).json(user);
                    connection.close();
                }
            });
        },
    });
});
