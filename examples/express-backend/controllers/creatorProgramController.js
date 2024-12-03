const NexusGG = require("nexus-node-sdk");

exports.validateCode = async (req, res) => {
  const { code } = req.params;

  try {
    const member = await NexusGG.manage.getMemberByCodeOrId(code);

    res.status(200).send(member);
  } catch (error) {
    if (error.code === "AuthenticationError") {
      res.status(401).json({ message: error.message });
    } else if (error.code === "MemberNotFoundError") {
      res.status(404).json({ message: error.message });
    } else if (error.code === "BadRequestError") {
      res.status(400).json({ message: error.message });
    } else {
      console.error("Unhandled error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    const queryParams = {
      page: 1,
      pageSize: 2,
    };
    const members = await NexusGG.manage.getAllMembers(queryParams);

    res.status(200).send(members);
  } catch (error) {
    if (error.code === "AuthenticationError") {
      res.status(401).json({ message: error.message });
    } else if (error.code === "MemberNotFoundError") {
      res.status(404).json({ message: error.message });
    } else if (error.code === "BadRequestError") {
      res.status(400).json({ message: error.message });
    } else {
      console.error("Unhandled error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
};
