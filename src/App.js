

import Editor from "@monaco-editor/react"
import { getValue } from "@testing-library/user-event/dist/utils";
import { useState, useRef } from "react"
import * as monaco from "monaco-editor";

export default function App(){

  const [contentString, setContentString] = useState('');

  const [language, setLanguage] = useState('javascript');

  const editorRef = useRef();

  

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  }

  const handleSave = () =>{
    
    setContentString(editorRef.current.getValue())
    console.log(contentString)
    //const language = editorRef.current.getModel().getModeId();
    //console.log(editorRef.current.getModeId())
    console.log("lenguaje,",language)
    
  }

  const dependLanguage = () =>{
    let abre, cierra;
    switch(language){
      case 'javascript':
        return {
          abre: "/*",
          cierra: "*/",
          abrir: "//",
          cerrar: ""
        }
      case 'r':
        return {
          abre: "#",
          cierra: "#",
          abrir: "#",
          cerrar: ""
        }
      case 'css':
        return {
          abre: "/*",
          cierra: "*/",
          abrir: "//",
          cerrar: ""
        }
      case 'python':
      return {
        abre: "'''",
        cierra: "'''",
        abrir: "#",
      }
      default:
        return {
          abre: "/*",
          cierra: "*/",
          abrir: "#",
          cerrar: ""
        }
    }
  }


  const commentByLine = () =>{
    const selection = editorRef.current.getSelection();
    const startLineNumber = selection.startLineNumber;
    const endLineNumber = selection.endLineNumber;
    const lines = [];

    for (let i = startLineNumber; i <= endLineNumber; i++) {
      lines.push(i);
    }

     const comment = dependLanguage().abrir;

    editorRef.current.executeEdits("", lines.map((lineNumber) => ({
      range: new monaco.Range(lineNumber, 1, lineNumber, 1),
      text: comment,
      forceMoveMarkers: true,
    })));
  }

  const disCommentByLine = () =>{
    const selection = editorRef.current.getSelection();
    const startLineNumber = selection.startLineNumber;
    const endLineNumber = selection.endLineNumber;
    const lines = [];
  
    for (let i = startLineNumber; i <= endLineNumber; i++) {
      lines.push(i);
    }
  
    const comment = dependLanguage().abrir;
  
    editorRef.current.executeEdits("", lines.map((lineNumber) => ({
      range: new monaco.Range(lineNumber, 1, lineNumber, 100),
      text: editorRef.current.getModel().getValueInRange(new monaco.Range(lineNumber, 1, lineNumber, 100)).replace(comment,''),
      forceMoveMarkers: true,
    })));
  }


  const commentByBlock = () =>{
    const selection = editorRef.current.getSelection();
    console.log(editorRef.current.getModel().getValueInRange(selection));
    
    const comentar = dependLanguage();
    if(language != 'r'){
      editorRef.current.executeEdits("",[
        {
          range: selection,
          text: comentar.abre + editorRef.current.getModel().getValueInRange(selection) + comentar.cierra
        }
      ])
    }
    else{
      commentByLine();
    }
  }

  const disCommentByBlock = () =>{
    const selection = editorRef.current.getSelection();
    console.log(editorRef.current.getModel().getValueInRange(selection));
    const comentar = dependLanguage();
    if(language != 'r'){
      editorRef.current.executeEdits("",[
        {
          range: selection,
          text: editorRef.current.getModel().getValueInRange(selection).replace(comentar.abre,'').replace(comentar.cierra,'')
        }
      ])
    }
    else{
      disCommentByLine();
    }
    
  }

  

  const handleSelection = () => {
    const selection = editorRef.current.getSelection();
    const contentLine = [];
    const comentar = dependLanguage();
  
    for (let lineNumber = selection.startLineNumber; lineNumber <= selection.endLineNumber; lineNumber++) {
      const text = editorRef.current.getModel().getLineContent(lineNumber);
      const result = comentar.abrir + text + '\n';
  
      editorRef.current.executeEdits('', [
        {
          range: selection,
          text: result
        },
      ]);
    }
  };


  
  


  return(
    <div style={{width:"70%", margin:'auto'}}>

      <h1>Editor de Prueba</h1>
      
        <button type="" onClick={handleSave} >Save</button>
        <button onClick={commentByLine}>Comment Line</button>
        <button onClick={disCommentByLine}>DisComment Line</button>
        <button onClick={commentByBlock}>Comment Block</button>
        <button onClick={disCommentByBlock}>DisComment Block</button>

        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="javascript">Javascript</option>
          <option value="r">R</option>
          <option value="css">CSS</option>
          <option value="python">Python</option>
        </select>
      
      
      <br/>
      <br/>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center', 
        margin: 'auto'
      }
        
      }>
      <Editor 
        height='80vh'
        width={'1000px'}
        theme="vs-dark"
        language={language}
        value="Vamos a comenzar haciendo una práctica elemental sobre el lenguaje C++."
        onChange={(value, defaultLanguage) => setContentString(value)}
        onMount={handleEditorDidMount}
        
      >
      </Editor>
      <pre style={{width: '300px', padding:'20px', border: '1px solid'}}>
        {contentString}
      </pre>
      </div>

      
    </div>
  )
}