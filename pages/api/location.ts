import { NextRequest } from "next/server";
import cors from "../../lib/cors";
import { distance } from "../../lib/distance";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
  switch (req.method) {
    case "POST":
      const { locations } = await req.json();
      const geo = req.geo;

      let closestCity, closestDistance;
      for (let location of locations) {
        let closest = distance(
          geo.latitude,
          geo.longitude,
          location.latitude,
          location.longitude,
          "K"
        );

        if (!closestDistance || closest < closestDistance) {
          closestDistance = closest;
          closestCity = location;
        }
      }
      return cors(req, new Response(JSON.stringify({ closestCity })));
    default:
      return cors(req, new Response(JSON.stringify(req.geo)));
  }
}
