import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("wisata","routes/wisata.tsx"),
    route("wisatadetail","routes/wisataDetail.tsx"),

] satisfies RouteConfig;
