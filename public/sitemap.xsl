<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

    <xsl:template match="/">
        <html lang="en">
            <head>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <title>Site Sitemap</title>
                <style>
                    body {
                        margin: 0;
                        font-family: "Trebuchet MS", "Segoe UI", sans-serif;
                        background:
                            radial-gradient(circle at top, #fef3c7 0%, #fff7ed 28%, #f8fafc 100%);
                        color: #0f172a;
                    }
                    .shell {
                        max-width: 1100px;
                        margin: 0 auto;
                        padding: 40px 24px 64px;
                    }
                    .hero {
                        padding: 28px 32px;
                        border-radius: 28px;
                        background: rgba(255, 255, 255, 0.88);
                        border: 1px solid rgba(148, 163, 184, 0.25);
                        box-shadow: 0 28px 60px rgba(15, 23, 42, 0.12);
                        backdrop-filter: blur(10px);
                    }
                    h1 {
                        margin: 0 0 8px;
                        font-size: clamp(2rem, 4vw, 3.25rem);
                        line-height: 1;
                    }
                    p {
                        margin: 0;
                        color: #475569;
                        font-size: 1rem;
                    }
                    .summary {
                        display: inline-block;
                        margin-top: 18px;
                        padding: 8px 12px;
                        border-radius: 999px;
                        background: #0f172a;
                        color: #f8fafc;
                        font-size: 0.875rem;
                        font-weight: 700;
                    }
                    .table-card {
                        margin-top: 24px;
                        overflow: hidden;
                        border-radius: 24px;
                        background: rgba(255, 255, 255, 0.92);
                        border: 1px solid rgba(148, 163, 184, 0.2);
                        box-shadow: 0 22px 45px rgba(15, 23, 42, 0.1);
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 16px 20px;
                        text-align: left;
                        vertical-align: top;
                    }
                    thead th {
                        background: #0f172a;
                        color: #f8fafc;
                        font-size: 0.8rem;
                        letter-spacing: 0.08em;
                        text-transform: uppercase;
                    }
                    tbody tr:nth-child(odd) {
                        background: rgba(248, 250, 252, 0.9);
                    }
                    tbody tr:hover {
                        background: rgba(254, 243, 199, 0.55);
                    }
                    td {
                        border-top: 1px solid rgba(226, 232, 240, 0.9);
                        font-size: 0.96rem;
                    }
                    a {
                        color: #0f766e;
                        font-weight: 700;
                        text-decoration: none;
                        word-break: break-word;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                    .priority {
                        display: inline-block;
                        min-width: 56px;
                        padding: 6px 10px;
                        border-radius: 999px;
                        background: #dcfce7;
                        color: #166534;
                        font-weight: 700;
                        text-align: center;
                    }
                    @media (max-width: 720px) {
                        .shell {
                            padding: 24px 14px 40px;
                        }
                        .hero {
                            padding: 22px 18px;
                            border-radius: 20px;
                        }
                        th, td {
                            padding: 12px 14px;
                        }
                        table {
                            font-size: 0.92rem;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="shell">
                    <div class="hero">
                        <h1>Site Sitemap</h1>
                        <p>Structured index of the public pages currently exposed by this site.</p>
                        <div class="summary">
                            <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs
                        </div>
                    </div>

                    <div class="table-card">
                        <table>
                            <thead>
                                <tr>
                                    <th>URL</th>
                                    <th>Last Modified</th>
                                    <th>Priority</th>
                                </tr>
                            </thead>
                            <tbody>
                                <xsl:for-each select="sitemap:urlset/sitemap:url">
                                    <tr>
                                        <td>
                                            <a>
                                                <xsl:attribute name="href">
                                                    <xsl:value-of select="sitemap:loc"/>
                                                </xsl:attribute>
                                                <xsl:value-of select="sitemap:loc"/>
                                            </a>
                                        </td>
                                        <td>
                                            <xsl:value-of select="sitemap:lastmod"/>
                                        </td>
                                        <td>
                                            <span class="priority">
                                                <xsl:value-of select="sitemap:priority"/>
                                            </span>
                                        </td>
                                    </tr>
                                </xsl:for-each>
                            </tbody>
                        </table>
                    </div>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
