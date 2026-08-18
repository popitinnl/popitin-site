/**
 * Het contactformulier.
 *
 * Vercel maakt van elk bestand in /api vanzelf een serverfunctie; daar is geen
 * framework of build-stap voor nodig. Er zitten bewust geen pakketten aan vast --
 * Resend heeft een gewone REST-API en Node kan zelf al `fetch`. Zo blijft de site
 * wat hij is: platte bestanden zonder node_modules.
 *
 * Instellen in Vercel onder Settings -> Environment Variables:
 *   RESEND_API_KEY      de sleutel van resend.com
 *   CONTACT_ONTVANGER   waar de aanvragen heen gaan
 *   CONTACT_AFZENDER    van welk adres ze komen; dat domein moet bij Resend
 *                       geverifieerd zijn, anders komt er niets aan
 */

/** Zet gebruikerstekst veilig in HTML. */
function veilig(tekst) {
  return String(tekst ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Twee vangnetten tegen spam, samen goed voor bijna alles.
 *
 * 1. Een verborgen veld dat een mens nooit invult en een bot klakkeloos wel.
 * 2. Het formulier stuurt mee hoe lang het openstond. Ontbreekt dat, of ging het
 *    binnen 2,5 seconde, dan is het geen mens.
 *
 * In beide gevallen een gewone bevestiging terugsturen en geen mail versturen. Een
 * bot die een foutmelding krijgt past zich aan; een bot die "gelukt" krijgt niet.
 */
function isSpam(body) {
  if (body.website) return "honeypot";
  const verstreken = Number(body.elapsedMs);
  if (!Number.isFinite(verstreken) || verstreken < 2500) return "tijdklem";
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Alleen POST" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

  const spam = isSpam(body);
  if (spam) {
    console.log(`[contact] geweigerd: ${spam}`);
    return res.status(200).json({ ok: true });
  }

  const naam = String(body.naam || "").trim();
  const email = String(body.email || "").trim();
  const bedrijf = String(body.bedrijf || "").trim();
  const rol = String(body.rol || "").trim();
  const bericht = String(body.bericht || "").trim();

  if (!naam || !email) {
    return res.status(400).json({ error: "Naam en e-mailadres zijn verplicht" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Dat e-mailadres klopt niet" });
  }

  const sleutel = process.env.RESEND_API_KEY;
  const ontvanger = process.env.CONTACT_ONTVANGER;
  const afzender = process.env.CONTACT_AFZENDER;

  if (!sleutel || !ontvanger || !afzender) {
    console.error("[contact] ontbrekende instellingen in Vercel");
    return res.status(500).json({ error: "Het formulier is nog niet ingesteld" });
  }

  try {
    const antwoord = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sleutel}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Pop it in <${afzender}>`,
        to: [ontvanger],
        // Zo kun je vanuit je mailprogramma direct antwoorden.
        reply_to: email,
        subject: `Aanvraag via popitin.nl — ${naam}${bedrijf ? ` (${bedrijf})` : ""}`,
        html: `
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:520px;color:#14263D">
            <p style="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#3E5C82">
              Nieuwe aanvraag via popitin.nl
            </p>
            <table style="border-collapse:collapse;font-size:15px">
              <tr><td style="padding:4px 16px 4px 0;color:#3E5C82">Naam</td><td><strong>${veilig(naam)}</strong></td></tr>
              <tr><td style="padding:4px 16px 4px 0;color:#3E5C82">E-mail</td><td>${veilig(email)}</td></tr>
              ${bedrijf ? `<tr><td style="padding:4px 16px 4px 0;color:#3E5C82">Bedrijf</td><td>${veilig(bedrijf)}</td></tr>` : ""}
              ${rol ? `<tr><td style="padding:4px 16px 4px 0;color:#3E5C82">Rol</td><td>${veilig(rol)}</td></tr>` : ""}
            </table>
            ${
              bericht
                ? `<div style="border-left:3px solid #79BD46;padding:8px 0 8px 14px;margin:20px 0;white-space:pre-wrap">${veilig(bericht)}</div>`
                : `<p style="color:#3E5C82">Geen bericht meegestuurd.</p>`
            }
          </div>
        `,
      }),
    });

    if (!antwoord.ok) {
      const fout = await antwoord.text();
      console.error(`[contact] Resend gaf ${antwoord.status}: ${fout}`);
      return res.status(502).json({ error: "Versturen is niet gelukt" });
    }

    console.log(`[contact] verstuurd namens ${email}`);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[contact] onverwachte fout:", err);
    return res.status(500).json({ error: "Versturen is niet gelukt" });
  }
}
