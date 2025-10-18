import React from "react";
import styled from "styled-components";
import FileIcons from "./FileIcons";
import { changeBytes, convertDates } from "./common";
import LottieImage from "./LottieImage";

// 🔐 imports for decrypt
import { ref, getBytes } from "firebase/storage";
import { storage } from "../../firebase";
import { decryptBytes } from "../utils/crypto";

const FilesList = ({ data = [], imagePath, text1, text2 }) => {
  // 🔐 Decrypt & Download (grid/cards)
  const handleDownloadEncrypted = async (fileDoc) => {
    try {
      const passphrase = prompt("Enter password to decrypt:");
      if (!passphrase) return;

      const filePath = fileDoc.data?.path;
      if (!filePath) {
        alert("❌ Missing path to encrypted file.");
        return;
      }

      const encryptedRef = ref(storage, filePath);
      const encryptedBytes = await getBytes(encryptedRef);

      const plainBytes = await decryptBytes(
        encryptedBytes,
        passphrase,
        fileDoc.data.crypto
      );

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
      alert("Wrong password or encrypted file was altered.");
    }
  };

  if (!data || data.length === 0) {
    return (
      <EmptyState>
        <LottieImage imagePath={imagePath} text1={text1} text2={text2} />
      </EmptyState>
    );
  }

  return (
    <Grid>
      {data.map((file) => (
        <Card key={file.id}>
          <IconWrap>
            <FileIcons type={file.data.originalType || file.data.contentType} />
          </IconWrap>

          <Info>
            <Title title={file.data.filename}>
              {file.data.isEncrypted ? `🔒 ${file.data.filename}` : file.data.filename}
            </Title>
            <Meta>
              <span>{changeBytes(file.data.size)}</span>
              <span>•</span>
              <span>{convertDates(file.data.timestamp?.seconds)}</span>
            </Meta>

            {/* 🔐 Action */}
            {file.data.isEncrypted ? (
              <ActionButton onClick={() => handleDownloadEncrypted(file)}>
                🔐 Decrypt & Download
              </ActionButton>
            ) : (
              <ActionLink
                href={file.data.fileURL}
                target="_blank"
                rel="noreferrer"
              >
                Download
              </ActionLink>
            )}
          </Info>
        </Card>
      ))}
    </Grid>
  );
};

const EmptyState = styled.div`
  width: 100%;
`;

const Grid = styled.div`
  width: 100%;
  display: grid;
  gap: 14px;
  padding: 10px 0;

  /* Desktop 4 cols, Tablet 3, Mobile 2, Tiny 1 */
  grid-template-columns: repeat(4, minmax(220px, 1fr));
  @media (max-width: 1100px) { grid-template-columns: repeat(3, minmax(200px, 1fr)); }
  @media (max-width: 768px)  { grid-template-columns: repeat(2, minmax(180px, 1fr)); }
  @media (max-width: 420px)  { grid-template-columns: 1fr; }
`;


const Card = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  background: #fff;
`;

const IconWrap = styled.div`
  flex: 0 0 auto;
  display: grid;
  place-items: center;
`;

const Info = styled.div`
  display: grid;
  gap: 6px;
`;

const Title = styled.div`
  font-weight: 600;
  color: #111827;
  max-width: 18ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.div`
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
`;

const ActionButton = styled.button`
  margin-top: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  cursor: pointer;
  font-weight: 600;
  &:hover { background: #f3f4f6; }
`;

const ActionLink = styled.a`
  margin-top: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  cursor: pointer;
  font-weight: 600;
  color: #111827;
  text-decoration: none;
  display: inline-block;
  &:hover { background: #f3f4f6; }
`;

export default FilesList;
