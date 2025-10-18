// ✅ FINAL LOCKED MAIN DATA — GOOGLE DRIVE STYLE (220px, fade, arrow, no push layout, meta inside)

import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  ArrowDownIcon,
  MoreOptionsIcon,
  StarFilledIcon,
  StarBorderIcon,
  DownloadIcon,
  CopyIcon,
  DeleteIcon,
  ShareIcon,
} from "../common/SvgIcons";
import { changeBytes, convertDates } from "../common/common";
import FileIcons from "../common/FileIcons";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";
import { handleStarred } from "../common/firebaseApi";
import { toast } from "react-toastify";
import LottieImage from "../common/LottieImage";
import { ref, getBytes } from "firebase/storage";
import { storage } from "../../firebase";
import { decryptBytes } from "../utils/crypto";

const MainData = ({ files, handleOptionsClick, optionsVisible, handleDelete }) => {
  const [showShareIcons, setShowShareIcons] = useState(false);
  const optionsMenuRef = useRef(null);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(e.target)) {
        handleOptionsClick(null);
        setShowShareIcons(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ SECURE DECRYPT & DOWNLOAD — PATCHED VERSION
const handleDownloadEncrypted = async (fileDoc) => {
  try {
    const passphrase = prompt("Enter password to decrypt:");
    if (!passphrase) return;

    // ✅ Validate crypto object exists
    const cryptoMeta = fileDoc?.data?.crypto;
    if (!cryptoMeta || !cryptoMeta.iv_b64 || !cryptoMeta.salt_b64) {
      return alert("❌ Encryption metadata missing. Restore may be incomplete.");
    }

    // ✅ Normalize crypto fields (ensure string & trimmed)
    const normalizedCrypto = {
      alg: cryptoMeta.alg || "AES-GCM",
      kdf: cryptoMeta.kdf || "PBKDF2-SHA256",
      iters: cryptoMeta.iters || 250000,
      iv_b64: String(cryptoMeta.iv_b64).trim(),
      salt_b64: String(cryptoMeta.salt_b64).trim(),
    };

    console.log("🔐 DEBUG - Using Crypto Metadata:", normalizedCrypto);

    // ✅ Fetch encrypted bytes from Firebase Storage
    const encryptedRef = ref(storage, fileDoc.data.path);
    const encryptedBytes = await getBytes(encryptedRef);

    // ✅ Decrypt using normalized metadata
    const plainBytes = await decryptBytes(encryptedBytes, passphrase, normalizedCrypto);

    // ✅ Create downloadable blob
    const blob = new Blob([plainBytes], {
      type: fileDoc.data.originalType || "application/octet-stream",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileDoc.data.filename || "file";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("❌ Decryption failed", err);
    alert("Wrong password or file data corrupted.");
  }
};


  const toggleSharePopover = (e) => {
    e.stopPropagation(); // Prevent dropdown from closing
    setShowShareIcons(!showShareIcons);
  };

  return (
    <div>
      {files.length > 0 && (
        <DataListRow>
          <div><b><ArrowDownIcon /> Name</b></div>
          <div className="fileSize"><b>File Size</b></div>
          <div className="modified"><b>Last Modified</b></div>
          <div><b>Options</b></div>
        </DataListRow>
      )}

      {files.length > 0 ? (
        files.map((file) => (
          <DataListRow key={file.id}>
            <div>
              <p className="starr" onClick={() => handleStarred(file.id)}>
                {file.data.starred ? <StarFilledIcon /> : <StarBorderIcon />}
              </p>
              {file.data.isEncrypted ? (
                <>
                  <FileIcons type={file.data.originalType || file.data.contentType} />
                  <span>🔒 {file.data.filename}</span>
                </>
              ) : (
                <a href={file.data.fileURL} target="_blank" rel="noopener noreferrer">
                  <FileIcons type={file.data.contentType} />
                  <span>{file.data.filename}</span>
                </a>
              )}
            </div>

            <div className="fileSize">{changeBytes(file.data.size)}</div>
            <div className="modified">{convertDates(file.data.timestamp?.seconds)}</div>

            <div style={{ position: "relative" }}>
              <OptionsTrigger onClick={() => handleOptionsClick(file.id)}>
                <MoreOptionsIcon />
              </OptionsTrigger>

              {optionsVisible === file.id && (
                <OptionsMenu ref={optionsMenuRef}>
                  {file.data.isEncrypted ? (
                    <MenuItem onClick={() => handleDownloadEncrypted(file)}>
                      <DownloadIcon /> Decrypt & Download
                    </MenuItem>
                  ) : (
                    <MenuItem as="a" href={file.data.fileURL} download target="_blank">
                      <DownloadIcon /> Download
                    </MenuItem>
                  )}

                  <MenuItem onClick={() => { navigator.clipboard.writeText(file.data.fileURL); toast.success("Link Copied"); }}>
                    <CopyIcon /> Copy Link
                  </MenuItem>

                  <MenuItem onClick={(e) => {
                    e.stopPropagation();
                    setShowShareIcons((prev) => !prev);}}>
                    <ShareIcon /> Share
                  </MenuItem>

                  {showShareIcons && (
                    <SharePopover onClick={(e) => e.stopPropagation()}>
                      <EmailShareButton url={file.data.fileURL}><EmailIcon size={32} round /></EmailShareButton>
                      <FacebookShareButton url={file.data.fileURL}><FacebookIcon size={32} round /></FacebookShareButton>
                      <LinkedinShareButton url={file.data.fileURL}><LinkedinIcon size={32} round /></LinkedinShareButton>
                      <WhatsappShareButton url={file.data.fileURL}><WhatsappIcon size={32} round /></WhatsappShareButton>
                    </SharePopover>
                  )}

                  <MenuItem className="delete" onClick={() => handleDelete(file.id, file.data)}>
                    <DeleteIcon /> Delete
                  </MenuItem>

                  <Meta>📅 {convertDates(file.data.timestamp?.seconds)}</Meta>
                  <Meta>📦 {changeBytes(file.data.size)}</Meta>
                </OptionsMenu>
              )}
            </div>
          </DataListRow>
        ))
      ) : (
        <LottieImage imagePath={"/homePage.svg"} text1={"A place for all of your files"} text2={"Use the 'New' button to upload"} />
      )}
    </div>
  );
};

export default MainData;

/* ✅ STYLES — LOCKED */

const DataListRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 0.8fr 1fr 0.5fr; /* ✅ Adjust ratios to fit screen nicely */
  width: 100%;
  padding: 10px 16px;
  align-items: center;
  border-bottom: 1px solid var(--border);
  font-size: 14px;

  b {
    font-weight: 600;
  }

  div {
  display: flex;
  align-items: center;
  gap: 8px; /* space between star, icon and file name */
}

.starr {
  margin-right: 6px;
}

a span {
  display: inline-block;
  max-width: 260px; /* Prevent overflow but keep inline */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


  @media screen and (max-width: 1024px) {
    grid-template-columns: 1.5fr 0.8fr 1fr 0.6fr;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 2fr 1fr 0.8fr;
    .modified { display: none; } /* Hide "Last Modified" */
  }

  @media screen and (max-width: 480px) {
    grid-template-columns: 2fr 0.8fr;
    .fileSize, .modified { display: none; } /* Show only name & options on mobile */
  }
`;


// ✅ Bigger 3-dots icon (Google Drive style)
const OptionsTrigger = styled.span`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px; /* Expanded hit area */
  height: 32px;
  svg {
    font-size: 28px; /* Increase dot size */
    padding: 6px;
    border-radius: 50%;
    transition: background 0.15s ease;
  }
  svg:hover {
    background: rgba(255,255,255,0.12);
  }
`;


const OptionsMenu = styled.span`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: absolute;
  background-color: #fff;
  border: 2px solid #ccc;
  top: -200%;
  right: 100%;
  cursor: pointer;
  z-index: 10;
  width: max-content;
  min-width: 120px;
  border-radius: 10px;

  /* 🌙 DARK MODE */
  body.dark-mode & {
    background-color: #2b2c2f;
    border: 2px solid #3d3e42;
  }

  &::before {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: #fff;
    top: 100px;
    right: -8px;
    transform: rotate(45deg);
    border-right: 1px solid #ccc;
    border-top: 1px solid #ccc;

    /* 🌙 DARK MODE ARROW */
    body.dark-mode & {
      background-color: #2b2c2f;
      border-right: 1px solid #3d3e42;
      border-top: 1px solid #3d3e42;
    }
  }

  span {
    width: 100%;
    border-bottom: 2px solid #ccc;
    padding: 10px;
    display: flex;
    align-items: center;

    /* 🌙 DARK MODE BORDER */
    body.dark-mode & {
      border-bottom: 2px solid #3d3e42;
    }

    a {
      color: #000;

      /* 🌙 DARK MODE TEXT */
      body.dark-mode & {
        color: #e5e7eb;
      }
    }

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: #ccc;
      z-index: 11;

      /* 🌙 DARK MODE HOVER */
      body.dark-mode & {
        background-color: #3a3b3f;
      }
    }
  }

  button {
    background-color: transparent;
    border: none;
    color: red;
    display: flex;
    align-items: center;
    justify-content: center;

    /* 🌙 DARK MODE RED */
    body.dark-mode & {
      color: #ff6b6b;
    }
  }

  a {
    color: #000;
    background-color: transparent;

    /* 🌙 DARK MODE TEXT */
    body.dark-mode & {
      color: #e5e7eb;
    }
  }

  .fileSize,
  .uploaded {
    background-color: #f0f0f0;
    cursor: default;

    /* 🌙 DARK MODE META BACKGROUND */
    body.dark-mode & {
      background-color: #2b2c2f;
      color: #cfcfcf;
    }
  }
`;



const MenuItem = styled.div`
  padding: 12px 14px;
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
  box-sizing: border-box;
  font-size: 15px;
  cursor: pointer;
  svg { font-size: 18px; }
  &:hover { background: var(--menu-hover); }
  &.delete { color: #e63946 !important; }
`;

const Meta = styled.div`
  padding: 10px 14px;
  font-size: 13px;
  opacity: .7;
  pointer-events: none;
`;

const ShareButton = styled.span`
  position: relative;
  cursor: pointer;

  span {
    width: max-content;
    height: max-content;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0;
    position: absolute;
    top: -80px;
    left: -60px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease-in-out;
  }

  .show {
    opacity: 1;
    visibility: visible;
  }

  &:hover {
    span {
      background-color: transparent;
    }
  }
`;

const SharePopover = styled.div`
  position: absolute;
  top: 0;
  right: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  background: var(--menu-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  box-shadow: var(--shadow);
  pointer-events: auto;
  z-index: 9999;
`;

