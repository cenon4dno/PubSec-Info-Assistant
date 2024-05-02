// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Outlet, NavLink, Link } from "react-router-dom";
import openai from "../../assets/openai.svg";
import { WarningBanner } from "../../components/WarningBanner/WarningBanner";
import { useRef, useState, useEffect } from "react";
import { Panel, DefaultButton} from "@fluentui/react";
import styles from "./Layout.module.css";
import { Title } from "../../components/Title/Title";
import { getFeatureFlags, GetFeatureFlagsResponse } from "../../api";
import { useEffect, useState } from "react";
import { ChatButton } from "../../components/ChatButton";
import { ModalChat } from "../../components/ModalChat";

export const Layout = () => {
    const [featureFlags, setFeatureFlags] = useState<GetFeatureFlagsResponse | null>(null);

    async function fetchFeatureFlags() {
        try {
            const fetchedFeatureFlags = await getFeatureFlags();
            setFeatureFlags(fetchedFeatureFlags);
        } catch (error) {
            // Handle the error here
            console.log(error);
        }
    }

    useEffect(() => {
        fetchFeatureFlags();
    }, []);

    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <WarningBanner />
                <div className={styles.headerContainer}>
                    <div className={styles.headerTitleContainer}>
                        <img src={openai} alt="Azure OpenAI" className={styles.headerLogo} />
                        <h3 className={styles.headerTitle}><Title /></h3>
                    </div>
                    <nav>
                        <ul className={styles.headerNavList}>
                            <li>
                                <NavLink to="/" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Home
                                </NavLink>
                            </li>
                            <li className={styles.headerNavLeftMargin}>
                                <NavLink to="/chat" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Chat
                                </NavLink>
                            </li>
                            <li className={styles.headerNavLeftMargin}>
                                <NavLink to="/content" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Manage Content
                                </NavLink>
                            </li>
                            {featureFlags?.ENABLE_MATH_ASSISTANT &&
                                <li className={styles.headerNavLeftMargin}>
                                    <NavLink to="/tutor" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Math Assistant
                                    <br />  
                                    <p className={styles.centered}>(preview)</p>
                                    </NavLink>
                                </li>
                            }
                            {featureFlags?.ENABLE_TABULAR_DATA_ASSISTANT &&
                                <li className={styles.headerNavLeftMargin}>
                                    <NavLink to="/tda" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Tabular Data Assistant
                                    <br />  
                                    <p className={styles.centered}>(preview)</p>
                                    </NavLink>
                                    
                                      
                                </li>
                            }
                    </ul>
                    </nav>
                </div>
            </header>

            <Outlet />

            <div className={styles.chatButton}>
                <ChatButton className={styles.commandButton} onClick={() => setIsInfoPanelOpen(!isInfoPanelOpen)} />
            </div>
            <Panel
                headerText="Modal Chat"
                isOpen={isInfoPanelOpen}
                isBlocking={false}
                onDismiss={() => setIsInfoPanelOpen(false)}
                closeButtonAriaLabel="Close"
                className={styles.modalchatpanel}
                onRenderFooterContent={() => <DefaultButton onClick={() => setIsInfoPanelOpen(false)}>Close</DefaultButton>}
                isFooterAtBottom={true}                >
                    <div id="modalChatMain">
                        <ModalChat/>
                    </div>
            </Panel>
            <footer>
                <WarningBanner />
            </footer>
        </div>
    );
};
