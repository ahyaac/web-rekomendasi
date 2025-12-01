import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("wisata","routes/wisata.tsx"),
    route("wisata/:id","routes/wisataDetail.tsx"),
    route("map","routes/MapPage.tsx"),

] satisfies RouteConfig;
