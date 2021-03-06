import React, { useState, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import useLocalStorage from "../hooks/useLocalStorage";

import Editor from "./Editor";

function App() {
  const [html, setHtml] = useLocalStorage("html", "");
  const [css, setCss] = useLocalStorage("css", "");
  const [js, setJs] = useLocalStorage("js", "");
  const [srcDoc, setSrcDoc] = useState("");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <body>${html}</body>
          <style>${css}</style>
          <script>${js}</script>
        </html>
      `);
    }, 250);

    return () => clearTimeout(timeout);
  }, [html, css, js]);

  const formHandler = (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    uploadFiles(file);
  };

  const uploadFiles = (file) => {
    if (!file) return;
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        setProgress(prog);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => console.log(url));
      }
    );
  };

  const input = document.querySelector('input[type="file"]');
  const inputChangeHandler = (e) => {
    let files = input.files;
    if (files.length == 0) return;
    const file = files[0];

    let reader = new FileReader();

    if (file.name.includes(".html")) {
      reader.onload = (e) => {
        const file = e.target.result;
        const lines = file.split(/\r\n|\n/);
        setHtml(lines.join("\n"));
      };
    } else if (file.name.includes(".css")) {
      reader.onload = (e) => {
        const file = e.target.result;
        const lines = file.split(/\r\n|\n/);
        setCss(lines.join("\n"));
      };
    } else if (file.name.includes(".js")) {
      reader.onload = (e) => {
        const file = e.target.result;
        const lines = file.split(/\r\n|\n/);
        setJs(lines.join("\n"));
      };
    }

    reader.onerror = (e) => alert(e.target.error.name);
    reader.readAsText(file);
  };

  const createFileHandler = () => {
    if (fileName.includes(".html")) {
      let newFile = new File(["Hello World!"], `${fileName}`, {
        type: "html/plain;charset=utf-8",
      });
      let reader = new FileReader();
      reader.readAsText(newFile);
      reader.onload = () => {
        setHtml(reader.result);
      };
    } else if (fileName.includes(".css")) {
      let newFile = new File(["Hello World!"], `${fileName}`, {
        type: "css/plain;charset=utf-8",
      });
      let reader = new FileReader();
      reader.readAsText(newFile);
      reader.onload = () => {
        setCss(reader.result);
      };
    } else if (fileName.includes(".js")) {
      let newFile = new File(["Hello World!"], `${fileName}`, {
        type: "js/plain;charset=utf-8",
      });
      let reader = new FileReader();
      reader.readAsText(newFile);
      reader.onload = () => {
        setJs(reader.result);
      };
    }
  };

  return (
    <div className="App">
      <div v className="row-top">
        <div className="col-left">
          <h1>Online Code Editor</h1>
          <form onSubmit={formHandler}>
            <input
              type="file"
              name="file"
              accept=".html, .css, .js"
              id="input"
              onChange={inputChangeHandler}
            />
            <button type="submit">Upload</button>
          </form>
          <h3>Uploaded {progress} %</h3>

          <div className="fileCreator">
            <input
              type="text"
              onChange={(e) => {
                setFileName(e.target.value);
              }}
              placeholder="Enter a name with(.Suffix)"
            />
            <button onClick={createFileHandler}>Create</button>
          </div>
        </div>
        <div className="pane top-pane col-right">
          <Editor
            language="xml"
            displayName="HTML"
            value={html}
            onChange={setHtml}
            fileType="html"
            fileName={fileName.split(".")[0]}
          />
          <Editor
            language="css"
            displayName="CSS"
            value={css}
            onChange={setCss}
            fileType="css"
            fileName={fileName.split(".")[0]}
          />
          <Editor
            language="javascript"
            displayName="JS"
            value={js}
            onChange={setJs}
            fileType="js"
            fileName={fileName.split(".")[0]}
          />
        </div>
      </div>
      <div className="row-down">
        <div className="pane">
          <iframe
            srcDoc={srcDoc}
            title="output"
            sandbox="allow-scripts"
            frameBorder="0"
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
