import React, { useState } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";
import { Controlled as ControlledEditor } from "react-codemirror2-react-17";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompressAlt,
  faExpandAlt,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

const Editor = (props) => {
  const { displayName, language, value, onChange, fileType } = props;

  const [open, setOpen] = useState(true);

  function handleChange(editor, data, value) {
    onChange(value);
  }

  const downloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([value], {
      type: `${fileType}/plain;charset=utf-8`,
    });

    element.href = URL.createObjectURL(file);
    element.download = `NewDocument.${fileType}`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className={`editor-container ${open ? "" : "collapsed"}`}>
      <div className="editor-title">
        {displayName}
        <div>
          <button className="Download" onClick={downloadFile}>
            <FontAwesomeIcon icon={faDownload} />
          </button>
          <button
            type="button"
            className="expand-collapse-btn"
            onClick={() => setOpen((prevOpen) => !prevOpen)}
          >
            <FontAwesomeIcon icon={open ? faCompressAlt : faExpandAlt} />
          </button>
        </div>
      </div>
      <ControlledEditor
        id="codeInput"
        onBeforeChange={handleChange}
        value={value}
        className="code-mirror-wrapper"
        options={{
          lineWrapping: true,
          lint: true,
          mode: language,
          theme: "material",
          lineNumbers: true,
        }}
      />
    </div>
  );
};

export default Editor;
