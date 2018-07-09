import Game from './game';
import Utils from "./helpers/utils";
import NoMobile from "./gui/nomobile";

//There is a temporary check to avoid mobile users to have a broken experience.
window.addEventListener("load", () => Utils.isMobile() ? new NoMobile() : new Game());
