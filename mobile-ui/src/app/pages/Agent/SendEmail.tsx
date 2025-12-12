// SendEmail.tsx
// This page allows agents to compose and send emails, including attachments, to citizens or other users.
// Features:
//   - Add/remove multiple recipients (To field)
//   - Edit/remove sender (From field)
//   - Subject and body input
//   - File attachment support
//   - Navigation to previous and home screens
//   - Uses localization for all labels and messages
// Used in: Agent workflow for property communication and correspondence

import React, { useState, useRef } from "react";
import "../../../styles/SendEmail.css";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { FiSend } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import { ArrowBackIosNew } from "@mui/icons-material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useLocalization } from "../../../services/AgentLocalisation/formLocalisation";
 

interface EmailFields {
  to: string[];
  from: string;
  subject: string;
  body: string;
  attachment?: File | null;
}

const DEFAULT_FROM = "agentkumar05@login.com";

const SendEmail: React.FC = () => {
  // State for email fields, input, and edit mode
  const [fields, setFields] = useState<EmailFields>({
    to: ["citizen01@login.com"],
    from: DEFAULT_FROM,
    subject: "",
    body: "",
    attachment: null,
  });
  const [inputTo, setInputTo] = useState("");
  const [fromEdit, setFromEdit] = useState(false);
  const fromInputRef = useRef<HTMLInputElement>(null);

  // Navigation and params
  // const { propertyId } = useParams();
  const navigate = useNavigate();


//   const handlePrevious = () => {
//  if (propertyId) {
//     navigate(`/agent/verification/${propertyId}`);
//  }else{
//     navigate('/agent/verification');
//  }
// };
  const handlePrevious = () => {
    navigate(-1);
  };

  // Subject/body change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
  };

  // Attachment
  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((f) => ({ ...f, attachment: e.target.files ? e.target.files[0] : null }));
  };

  // "To" chips
  const handleToInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputTo(e.target.value);
  const handleToInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputTo.trim()) {
      e.preventDefault();
      if (!fields.to.includes(inputTo.trim()))
        setFields((f) => ({ ...f, to: [...f.to, inputTo.trim()] }));
      setInputTo("");
    } else if (e.key === "Backspace" && !inputTo && fields.to.length > 0) {
      setFields((f) => ({ ...f, to: f.to.slice(0, -1) }));
    }
  };
  const handleRemoveToChip = (email: string) => {
    setFields((f) => ({ ...f, to: f.to.filter((e) => e !== email) }));
  };

  // "From" chip edit/clear
  const handleRemoveFrom = () => {
    setFields((f) => ({ ...f, from: "" }));
    setFromEdit(true);
    setTimeout(() => fromInputRef.current?.focus(), 0);
  };
  const handleEditFrom = () => {
    setFromEdit(true);
    setTimeout(() => fromInputRef.current?.focus(), 0);
  };
  const handleFromInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((f) => ({ ...f, from: e.target.value }));
  };
  const handleFromInputBlur = () => {
    if (fields.from) setFromEdit(false);
  };
  const handleFromInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && fields.from) {
      setFromEdit(false);
      e.preventDefault();
    }
  };
   const handleHome = () => {
    navigate("/agent");
  }

  // Send/discard
  const handleSend = () => alert("Email data ready for backend:\n" + JSON.stringify(fields, null, 2));
  const handleDiscard = () => {
    setFields({
      to: [],
      from: "",
      subject: "",
      body: "",
      attachment: null,
    });
    setInputTo("");
    setFromEdit(false);
  };

  const {
    SendEmailText,
InternalCorrspondenceWithSericeManagerText,
previousText,
ToText,
FromText,
SubjectText,
ComposeEmailText,
DiscardText,
HomeText
} = useLocalization();

  // Render SendEmail page UI
  return (
    <div className="send-email-root">
      {/* Header section with title, subtitle, and navigation buttons */}
      <div className="send-email-header">
        <div className="header-content">
            <h1 className="form-titles">{SendEmailText}</h1>
            <div className="form-subtitle">
              {InternalCorrspondenceWithSericeManagerText}
            </div>
          </div>
            <div className="step-header-buttons">
              <button
                style={{ paddingLeft: '5%', paddingRight: '5%' }}
                className="step-header-btn-style"
                onClick={handlePrevious}
              >
                <ArrowBackIosNew className="step-header-btn-icon" />
                <span className="step-header-btn-text">{previousText}</span>
              </button>
              <button
                style={{ paddingLeft: '5%', paddingRight: '5%' }}
                className="step-header-btn-style"
                onClick={handleHome}
              >
                <HomeOutlinedIcon className="step-header-btn-icon"  style={{marginLeft:"8"}}/>
                <span className="step-header-btn-text">{HomeText}</span>
              </button>
            </div>
        {/* <div className="send-email-title">Send Email</div>
        <div className="send-email-subtitle">Internal Correspondence with Service Manager</div> */}
      </div>
     
    {/* Actions row for attach and send */}
    <div className="send-email-actions-row">
  <label className="icon-btn attach-btn" title="Attach">
    <input type="file" style={{ display: "none" }} onChange={handleAttachment} />
    <div className="icon-attach"><AttachFileIcon /></div>
  </label>
  <button className="icon-btn send-btn" onClick={handleSend} title="Send" type="button">
    <div className="icon-send"><FiSend /></div>
  </button>
</div>
      <form className="send-email-form" onSubmit={e => { e.preventDefault(); handleSend(); }}>
        {/* TO FIELD: Add/remove multiple recipients */}
        <div className="form-group form-group-float">
          <div className="float-label-wrap">
            <div className="chip-input">
              {fields.to.map((email) => (
                <span className="email-chip" key={email}>
                  {email}
                  <button
                    type="button"
                    className="chip-remove"
                    onClick={() => handleRemoveToChip(email)}
                    aria-label="Remove recipient"
                  >×</button>
                </span>
              ))}
              <input
                className="email-input no-underline"
                name="to"
                type="email"
                value={inputTo}
                onChange={handleToInputChange}
                onKeyDown={handleToInputKeyDown}
                placeholder={fields.to.length === 0 ? "" : undefined}
                autoComplete="off"
                spellCheck={false}
                style={{ flex: 1, minWidth: 120 }}
              />
            </div>
            <span className={`float-label${fields.to.length || inputTo ? " filled" : ""}`}>{ToText}</span>
            <span className="dropdown-arrow">&#9662;</span>
          </div>
        </div>
        {/* FROM FIELD: Edit/remove sender */}
        <div className="form-group form-group-float">
          <div className="float-label-wrap">
            {fromEdit || !fields.from ? (
              <input
                className="email-input no-underline"
                name="from"
                type="email"
                value={fields.from}
                onChange={handleFromInputChange}
                onBlur={handleFromInputBlur}
                onKeyDown={handleFromInputKeyDown}
                ref={fromInputRef}
                autoComplete="off"
                spellCheck={false}
                style={{ flex: 1, minWidth: 120 }}
              />
            ) : (
              <span className="email-chip from-chip">
                {fields.from}
                <button
                  type="button"
                  className="chip-edit"
                  onClick={handleEditFrom}
                  aria-label="Edit sender"
                  tabIndex={0}
                  title="Edit"
                >✎</button>
                <button
                  type="button"
                  className="chip-remove"
                  onClick={handleRemoveFrom}
                  aria-label="Remove sender"
                  tabIndex={0}
                  title="Remove"
                >×</button>
              </span>
            )}
            <span className={`float-label${fields.from ? " filled" : ""}`}>{FromText}</span>
            <span className="dropdown-arrow">&#9662;</span>
          </div>
        </div>
        {/* SUBJECT: Input for email subject */}
        <div className="form-group form-group-float">
          <div className="float-label-wrap">
            <input
              className="email-input"
              name="subject"
              value={fields.subject}
              onChange={handleChange}
              autoComplete="off"
              spellCheck={false}
            />
            <span className={`float-label${fields.subject ? " filled" : ""}`}>{SubjectText}</span>
          </div>
        </div>
        {/* COMPOSE EMAIL: Input for email body */}
        <div className="form-group form-group-float">
          <div className="float-label-wrap">
            <textarea
              className="email-textarea"
              name="body"
              placeholder=""
              rows={4}
              value={fields.body}
              onChange={handleChange}
            />
            <span className={`float-label${fields.body ? " filled" : ""}`}>{ComposeEmailText}</span>
          </div>
        </div>
        {/* Discard button */}
        <button type="button" className="discard-btn" onClick={handleDiscard}>
          {DiscardText}
        </button>
      </form>
    </div>
  );
};

// Export SendEmail for use in agent communication
export default SendEmail;