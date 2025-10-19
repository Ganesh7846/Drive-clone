import styled from "styled-components";
import { Modal } from "@mui/material";
import Lottie from "react-lottie-player";
import linkedInJson from "../lottie/linkedInLottie.json";
import githubJson from "../lottie/githubLottie.json";
import instaJson from "../lottie/instaLottie.json";
import facebookJson from "../lottie/facebookLottie.json";
import closeJson from "../lottie/closeLottie.json";

const HelpModal = ({ openHelp, closeHelpModal }) => {
  return (
    <Modal open={openHelp} onClose={closeHelpModal}>
      <ModalPopup>
        <span onClick={closeHelpModal}>
          <Lottie
            loop
            animationData={closeJson}
            play
            style={{ width: 40, height: 40 }}
          />
        </span>
        <ModalHeading>
          <h3>Need Help?</h3>
        </ModalHeading>
        <ModalBody>
          <div className="image">
            <img src="public/Profile_avatar_placeholder_large.png" alt="" />
          </div>
          <h2>Chetan Gowda K</h2>
          <p>Contact Me:</p>
          <div className="links">
            <a
              href="https://github.com/ChetanGowdak"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Lottie
                loop
                animationData={githubJson}
                play
                style={{ width: 50, height: 50 }}
              />
              Github
            </a>
            <a
              href="https://www.linkedin.com/in/chetan-gowda-23a04938b"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Lottie
                loop
                animationData={linkedInJson}
                play
                style={{ width: 50, height: 50 }}
              />
              LinkedIn
            </a>
          </div>

          <div className="image">
            <img src="public/Profile_avatar_placeholder_large.png" alt="" />
          </div>
          <h2>M Premananda</h2>
          <p>Contact Me:</p>
          <div className="links">
            <a
              href="https://github.com/M-Premananda"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Lottie
                loop
                animationData={githubJson}
                play
                style={{ width: 50, height: 50 }}
              />
              Github
            </a>
            <a
              href="https://www.linkedin.com/in/m-premananda-385110355/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Lottie
                loop
                animationData={linkedInJson}
                play
                style={{ width: 50, height: 50 }}
              />
              LinkedIn
            </a>
          </div>

          <div className="image">
            <img src="public/Profile_avatar_placeholder_large.png" alt="" />
          </div>
          <h2>Ganesh</h2>
          <p>Contact Me:</p>
          <div className="links">
            <a
              href="https://github.com/Ganesh7846"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Lottie
                loop
                animationData={githubJson}
                play
                style={{ width: 50, height: 50 }}
              />
              Github
            </a>
            <a
              href="https://www.linkedin.com/in/ganesh-n-bambulage-340691380/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Lottie
                loop
                animationData={linkedInJson}
                play
                style={{ width: 50, height: 50 }}
              />
              LinkedIn
            </a>
          </div>

          <div className="image">
            <img src="public/Profile_avatar_placeholder_large.png" alt="" />
          </div>
          <h2>Aishwarya K</h2>
          <p>Contact Me:</p>
          <div className="links">
            <a
              href="https://github.com/Aishubidda"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Lottie
                loop
                animationData={githubJson}
                play
                style={{ width: 50, height: 50 }}
              />
              Github
            </a>
            <a
              href="https://www.linkedin.com/in/aishwarya17407"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Lottie
                loop
                animationData={linkedInJson}
                play
                style={{ width: 50, height: 50 }}
              />
              LinkedIn
            </a>
          </div>
        </ModalBody>
      </ModalPopup>
    </Modal>
  );
};

const ModalPopup = styled.div`
  top: 50%;
  background-color: var(--bg);          
  color: var(--text);                   
  width: 100%;
  max-width: 500px;
  margin: 0px auto;
  position: relative;
  transform: translateY(-50%);
  padding: 15px;
  border-radius: 10px;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid var(--border);
  transition: all 0.3s ease;

  span {
    position: absolute;
    right: 10px;
    top: 8px;
    cursor: pointer;
    color: var(--text);
  }

  & * {
    color: var(--text) !important;
    background: transparent !important;
  }
`;


const ModalHeading = styled.div`
  text-align: center;
  border-bottom: 1px solid lightgray;
  height: 40px;
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 15px;
  color: var(--text); /* ✅ Inherit theme color */

  .image {
    width: 100%;
    max-width: 150px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 1rem;

    img {
      height: 100%;
      width: 100%;
      filter: brightness(0.95); /* ✅ Smooth on dark mode */
    }
  }

  h4 {
    margin-bottom: 1rem;
    color: var(--text);  /* ✅ Removed hardcoded grey */
    font-size: 0.9rem;
    letter-spacing: 1px;
  }

  p {
    margin-bottom: 0.5rem;
    text-decoration: underline;
    color: var(--text);
  }

  .links {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    gap: 1rem;

    a {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      color: var(--text) !important; /* ✅ Forces icon names to adapt in dark mode */

      /* ✅ Maintain brand colors only for the icons — NOT the text */
      svg {
        filter: drop-shadow(0 0 2px rgba(0,0,0,0.2));
      }
    }
  }
`;


export default HelpModal;
