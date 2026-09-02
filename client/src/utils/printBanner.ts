/** Prints the Vaultisse ASCII banner to the browser console on app start. */
export function printBanner(): void {
    const banner = String.raw`
██╗   ██╗ █████╗ ██╗   ██╗██╗  ████████╗██╗███████╗███████╗███████╗
██║   ██║██╔══██╗██║   ██║██║  ╚══██╔══╝██║██╔════╝██╔════╝██╔════╝
██║   ██║███████║██║   ██║██║     ██║   ██║███████╗███████╗█████╗
╚██╗ ██╔╝██╔══██║██║   ██║██║     ██║   ██║╚════██║╚════██║██╔══╝
 ╚████╔╝ ██║  ██║╚██████╔╝███████╗██║   ██║███████║███████║███████╗
  ╚═══╝  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝   ╚═╝╚══════╝╚══════╝╚══════╝
`;

    console.log(`%c${banner}`, "color: #7c4dff; font-weight: bold;");
    console.log(
        "%cThis project is open source — contributions and issues welcome!\nhttps://github.com/AlbertAmat/vaultisse",
        "color: #7c4dff;"
    );
}
