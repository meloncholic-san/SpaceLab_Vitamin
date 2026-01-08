import { useLoadFunction } from "lazy-viewport-loader";


export function initMain() {
    useLoadFunction(
        async () => {
            const { initMainProjects } = await import('./main/initMainProjects');
            initMainProjects();
            },
        '.main-projects'
    );

        useLoadFunction(
        async () => {
            const { initReviews } = await import('../components/init-reviews');
            initReviews();
            },
        '.main-reviews'
    );

}