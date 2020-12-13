// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export default async (req, res) => {
  const connection = await mongoose.createConnection(
    "mongodb://admin:pass@localhost:27017/admin",
    {
      useNewUrlParser: true,
      bufferCommands: false,
      bufferMaxEntries: 0,
      useUnifiedTopology: true,
    }
  );

  try {
    const User = connection.model("User", UserSchema);
    const { body: { name }, method } = req
    switch (method) {
      case "GET":
        const user = await User.find({})
        res.status(200).json(user)
        connection.close();
        break;
      case "POST":
        User.create({ name }, (error, user) => {
          if (error) {
            connection.close();
            res.status(500).json({ error });
          } else {
            res.status(200).json(user);
            connection.close();
          }
        });
        break;
      default:
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (e) {
    connection.close();
    res.status(500).json({ error: e.message || "something went wrong" });
  }
};


