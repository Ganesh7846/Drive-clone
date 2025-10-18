import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PageHeader from "../common/PageHeader";
import { auth } from "../../firebase";
import { getTrashFiles, restoreFile, handleDeleteFromTrash } from "../common/firebaseApi";
import FileIcons from "../common/FileIcons";
import { changeBytes, convertDates } from "../common/common";
import { DeleteIcon } from "../common/SvgIcons";

const Trash = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsub = getTrashFiles(user.uid, setFiles);
    return () => unsub && unsub();
  }, []);

  return (
    <TrashContainer>
      <PageHeader pageTitle={"Trash"} />
      {files.length === 0 ? (
        <Empty>Nothing in Trash</Empty>
      ) : (
        <Grid>
          {files.map((file) => (
            <Card key={file.id}>
              <IconWrap>
                <FileIcons type={file.data.originalType || file.data.contentType || "application/octet-stream"} />
              </IconWrap>

              <Info>
                <Title title={file.data.filename}>🗑 {file.data.filename}</Title>
                <Meta>
                  <span>{changeBytes(file.data.originalSize || file.data.size)}</span>
                  <span>•</span>
                  <span>Deleted: {convertDates(file.data.deletedAt?.seconds || file.data.timestamp?.seconds)}</span>
                </Meta>

                <Actions>
                  <RestoreBtn onClick={() => restoreFile(file.id)}>♻ Restore</RestoreBtn>
                  <DeleteBtn onClick={() => handleDeleteFromTrash(file.id, file.data)}>
                    <DeleteIcon /> Delete forever
                  </DeleteBtn>
                </Actions>
              </Info>
            </Card>
          ))}
        </Grid>
      )}
    </TrashContainer>
  );
};

export default Trash;

// ===== styles =====
const TrashContainer = styled.div`
  flex: 1;
  padding: 10px 10px 0 20px;
`;

const Empty = styled.div`
  padding: 40px 10px;
  color: #6b7280;
`;

const Grid = styled.div`
  width: 100%;
  display: grid;
  gap: 14px;
  padding: 10px 0;

  /* Desktop 4 cols, Tablet 3, Mobile 2 */
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

  svg { font-size: 28px; color: #6b7280; }
`;

const Info = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0; /* enable text truncation */
`;

const Title = styled.div`
  font-weight: 600;
  color: #111827;
  max-width: 20ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.div`
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
  flex-wrap: wrap;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const BtnBase = styled.button`
  margin-top: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  cursor: pointer;
  font-weight: 600;
  &:hover { background: #f3f4f6; }
`;

const RestoreBtn = styled(BtnBase)`
  color: #065f46;
  border-color: #a7f3d0;
  background: #ecfdf5;
  &:hover { background: #d1fae5; }
`;

const DeleteBtn = styled(BtnBase)`
  color: #991b1b;
  border-color: #fecaca;
  background: #fef2f2;
  display: inline-flex; align-items: center; gap: 6px;
  &:hover { background: #fee2e2; }
`;
