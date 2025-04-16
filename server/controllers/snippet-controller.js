import Snippet from "../models/snippet-model.js";
import User from "../models/user-model.js";

export const createSnippet = async (req, res) => {
  try {
    const { title, description = "", code, language = "" } = req.body;
    if (!title || !code) {
      return res.status(400).json({ msg: "No code or title !" });
    }
    const snippet = new Snippet({
      title,
      description,
      code,
      language,
      admin: req.user._id,
    });
    const result = await snippet.save();
    if (!result) {
      return res.status(400).json({ msg: "Error while saving snippet !" });
    }
    await User.findByIdAndUpdate(req.user._id, {
      $push: { snippets: result._id },
    });
    res.status(201).json({ msg: "Snippet created successfully !" });
  } catch (err) {
    res
      .status(400)
      .json({ msg: "Error in creating snippet !", err: err.message });
  }
};

export const getAllSnippet = async (req, res) => {
  try {
    const snippets = await Snippet.find({}).populate("admin", "-password");
    if (!snippets) {
      return res.status(404).json({ msg: "No snippets found !" });
    }
    res.status(200).json(snippets);
  } catch (err) {
    res.status(500).json({ msg: "Error in fetching snippets !" });
  }
}

export const singleUserSnippet = async (req, res) => {
  try {
    const { id } = req.params;
    const snippet = await Snippet.find({admin:id});
    if (!snippet) {
      return res.status(404).json({ msg: "No snippets found !" });
    }
    res.status(200).json(snippet);
  } catch (err) {
    res.status(500).json({ msg: "Error in fetching snippets !" });
  }
}

export const singleSnippet = async (req, res) => {
  try {
    const { id } = req.params;
    const snippet = await Snippet.findById(id).populate("admin", "-password");
    if (!snippet) {
      return res.status(404).json({ msg: "No snippets found !" });
    }
    res.status(200).json(snippet);
  } catch (err) {
    res.status(500).json({ msg: "Error in fetching snippet !" });
  }
}

export const deleteSnippet = async (req, res) => {
  try {
    const { id } = req.params;
    const snippet = await Snippet.findById(id);

    if (!snippet) {
      return res.status(404).json({ msg: "No snippets found !" });
    }

    if (snippet.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "You are not authorized to delete!" });
    }

    await Snippet.findByIdAndDelete(id);

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { snippets: id },
    });
    res.status(200).json({ msg: "Snippet deleted successfully !" });
  } catch (err) {
    res.status(500).json({ msg: "Error in deleting snippet !" });
  }
}

export const updateSnippet = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, code, language } = req.body;
    const snippet = await Snippet.findById(id);

    if (!snippet) {
      return res.status(404).json({ msg: "No snippets found !" });
    }

    if (snippet.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "You are not authorized to update!" });
    }
    
    await Snippet.findByIdAndUpdate(
      id,
      { title, description, code, language },
      { new: true }
    );
    if (!snippet) {
      return res.status(404).json({ msg: "No snippets found !" });
    }
    res.status(200).json({ msg: "Snippet updated successfully !" });
  } catch (err) {
    res.status(500).json({ msg: "Error in updating snippet !" });
  }
}