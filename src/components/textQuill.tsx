import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const TextQuill = ({description, setdescription}: {description: string, setdescription: (value: string) => void}) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "formula",
    "ql-code-block",
    "list",
    "bullet",
    "indent",
    "link",
  ];
  return (
    <>
      <ReactQuill
        style={{ width: "100%", height: "70%" }}
        theme="snow"
        value={description}
        modules={modules}
        formats={formats}
        onChange={setdescription}
      />
    </>
  );
};

export default TextQuill;
