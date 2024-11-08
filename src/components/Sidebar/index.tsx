import SideBarIcon from "@/UI/Icons/SideBarIcon";
import { SidebarData } from "@/utils/const";
import Link from "next/link";

export default function Sidebar() {
    return (
        <>
            <div className="side-menu">
                <ul className="side-menu-items">
                    {SidebarData.map((item, index) => {
                        return (
                            <li key={index} className={item.cName}>
                                <Link href={item.path}>
                                    <SideBarIcon keyIcon={item.icon} />
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}
