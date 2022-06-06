import * as React from "react";
import BOLD from "../../../assets/images/icons/bold.svg";
import LINK from "../../../assets/images/icons/link.svg";
import ITALIC from "../../../assets/images/icons/italic.svg";
import UNDERLINE from "../../../assets/images/icons/underline.svg";
import UNORDERED from "../../../assets/images/icons/unordered_list.svg";
import ORDERED from "../../../assets/images/icons/ordered_list.svg";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {EditorState} from 'draft-js';

export const TextEditor = (props) => {
    const [editorState, setEditorState] = React.useState(EditorState.createEmpty())
    const {onChange, className} = props;


    const onEditorStateChange = (updatedEditorState) => {
        setEditorState(updatedEditorState)
        onChange(updatedEditorState)
    }

    return (
        <Editor
            wrapperClassName={className}
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            toolbar={{
                options: ['inline', 'list', 'link'],
                inline: {
                    options: ['bold', 'italic', 'underline'],
                    bold: {icon: BOLD},
                    italic: {icon: ITALIC},
                    underline: {icon: UNDERLINE},
                },
                list: {
                    inDropdown: false,
                    options: ['unordered', 'ordered'],
                    unordered: {icon: UNORDERED},
                    ordered: {icon: ORDERED},
                },
                link: {
                    inDropdown: false,
                    showOpenOptionOnHover: true,
                    defaultTargetOption: '_blank',
                    options: ['link'],
                    link: {icon: LINK},
                },
            }}
        />
    );
};