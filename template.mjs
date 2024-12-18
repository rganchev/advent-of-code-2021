import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const input = _.compact((await fetchInputForDay($day, $year)).split("\n"));
}
