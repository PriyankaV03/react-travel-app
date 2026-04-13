import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { type ComponentType, type MouseEvent, useRef } from "react";
import { Link } from "react-router";
import NavItems from "./NavItems";

export default function MobileSidebar() {
    const sidebarRef = useRef<SidebarComponent | null>(null);
    const toggleSidebar = (event?: MouseEvent<HTMLButtonElement>) => {
        sidebarRef.current?.toggle();
    };
    return (
        <div className="mobile-sidebar wrapper">
            <header>
                <Link to="/">
                   <img
                        src="/assets/icons/logo.svg"
                        alt="Logo"
                        className="size-[30px]" />
                    <h1>Travel Visualization Hub</h1>
                </Link>

                <button 
                type="button" 
                aria-label="Toggle menu" 
                onClick={toggleSidebar}>
                    <img src="/assets/icons/menu.svg" alt="menu" className="size-7" />
                </button>
            </header>

            <SidebarComponent
                width={270}
                ref={(instance: SidebarComponent | null) => {
                    sidebarRef.current = instance;
                }}
                created={() => sidebarRef.current?.hide()}
                closeOnDocumentClick={true}
                showBackdrop={true}
                type="Over"
            >
                <NavItems handleClick={toggleSidebar} />
            </SidebarComponent>
        </div>
    );
}