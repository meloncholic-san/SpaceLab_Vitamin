import { getCurrentUser } from "../../services/auth";
import { initProfileBilling } from "./init-profileBilling";
import { initProfileOrders } from "./init-profileOrders";
import { initProfileOverview } from "./init-profileOverview";
import { initProfilePassword } from "./init-profilePassword";
import { initProfileSidebar } from "./init-profileSidebar";
import { initProfileSubs } from "./init-profileSubs";

export async function initProfile() {
    const { data: { user } } = await getCurrentUser();

    if (!user) return;
    initProfileSidebar();
    console.log("user", user.id)

    initProfileSubs(user.id);
    initProfileOrders(user.id);
    initProfileOverview();
    initProfileBilling();
    initProfilePassword();
}