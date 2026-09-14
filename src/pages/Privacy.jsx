import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#f8f4e9]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#155c3a]">
            RentSpace
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#0d3b2e] sm:text-4xl">
            Privacy Policy
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Last updated: 14 September 2026
          </p>

          <div className="mt-10 space-y-8 text-[15px] leading-7 text-gray-700">
            <section>
              <h2 className="text-xl font-bold text-[#0d3b2e]">
                1. Introduction
              </h2>

              <p className="mt-3">
                RentSpace respects your privacy and is committed to handling
                personal information responsibly.
              </p>

              <p className="mt-3">
                This Privacy Policy explains how RentSpace collects, uses,
                stores and shares personal information when you create an
                account, list a space, communicate with another user or use
                the RentSpace platform.
              </p>

              <p className="mt-3">
                RentSpace operates primarily in Zimbabwe and this Policy is
                intended to reflect applicable Zimbabwean data protection
                requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0d3b2e]">
                2. Information We Collect
              </h2>

              <p className="mt-3">
                Depending on how you use RentSpace, we may collect:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>First and last name</li>
                <li>Email address</li>
                <li>Telephone number</li>
                <li>Account and authentication information</li>
                <li>Profile information and profile photographs</li>
                <li>Property and listing information</li>
                <li>Photographs uploaded to listings</li>
                <li>Messages exchanged through RentSpace</li>
                <li>Information contained in support or complaint requests</li>
                <li>
                  Technical information required to operate and secure the
                  website
                </li>
              </ul>

              <p className="mt-3">
                We aim to collect only information reasonably necessary for
                legitimate purposes connected with operating and improving
                RentSpace.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0d3b2e]">
                3. How We Use Information
              </h2>

              <p className="mt-3">
                We may use personal information to:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Create and manage user accounts</li>
                <li>Authenticate users and maintain account security</li>
                <li>Display listings and relevant profile information</li>
                <li>Allow renters and owners to communicate</li>
                <li>Respond to questions, complaints and support requests</li>
                <li>Detect and prevent fraud, abuse and security incidents</li>
                <li>Maintain and improve RentSpace</li>
                <li>Comply with legal and regulatory obligations</li>
                <li>
                  Communicate important service-related information to users
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0d3b2e]">
                4. Legal Basis for Processing
              </h2>

              <p className="mt-3">
                Personal information will be processed in accordance with
                applicable law. Depending on the circumstances, processing may
                be based on your consent, the performance of a service you
                requested, compliance with a legal obligation, protection of
                vital interests, or another lawful basis recognised by
                applicable data protection law.
              </p>

              <p className="mt-3">
                Where consent is required, we aim to obtain it in a clear and
                informed manner. Consent may be withdrawn where permitted by
                law, although withdrawing consent may affect our ability to
                provide particular services.
              </p>

              <p className="mt-3">
                Zimbabwe's data protection framework requires processing to be
                fair and lawful and requires personal information to be
                collected for specified, explicit and legitimate purposes.
                :contentReference[oaicite:1]{index=1}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0d3b2e]">
                5. Information Shared With Other Users
              </h2>

              <p className="mt-3">
                Some information is necessarily visible to other users when
                you use RentSpace.
              </p>

              <p className="mt-3">
                For example, information included in a public listing may be
                displayed to people browsing RentSpace. When you communicate
                with another user, information contained in your account or
                messages may be available to the recipient.
              </p>

              <p className="mt-3">
                You should therefore avoid including unnecessary sensitive
                personal information in public listings or messages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0d3b2e]">
                6. Service Providers
              </h2>

              <p className="mt-3">
                We may use trusted third-party service providers to operate
                RentSpace, including providers for hosting, databases,
                infrastructure, email, security, analytics or other technical
                services.
              </p>

              <p className="mt-3">
                Such providers may process information on our behalf where
                necessary to provide their services.
              </p>

              <p className="mt-3">
                Where personal information is transferred outside Zimbabwe,
                RentSpace will take account of applicable requirements relating
                to cross-border transfers and appropriate protection of
                personal information. :contentReference[oaicite:2]{index=2}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0d3b2e]">
                7. Data Security
              </h2>

              <p className="mt-3">
                We use reasonable technical and organisational measures to
                protect personal information against unauthorised access,
                alteration, disclosure, loss or destruction.
              </p>

              <p className="mt-3">
                However, no internet service can guarantee absolute security.
                Users should also protect their passwords and avoid sharing
                account credentials.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0d3b2e]">
                8. Retention
              </h2>

              <p className="mt-3">
                We retain personal information for as long as reasonably
                necessary for the purposes for which it was collected,
                including operating the service, maintaining appropriate
                records, resolving disputes, preventing fraud and complying
                with legal obligations.
              </p>

              <p className="mt-3">
                When information is no longer reasonably required, we may
                delete, anonymise or securely dispose of it, subject to legal
                or legitimate retention requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0d3b2e]">
                9. Your Rights
              </h2>

              <p className="mt-3">
                Subject to applicable law and any relevant limitations, you may
                have rights concerning your personal information, including
                rights to:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Request access to personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion where legally applicable</li>
                <li>Withdraw consent where processing is based on consent</li>
                <li>Raise concerns about how your information is processed</li>
              </ul>

              <p className="mt-3">
                We may need to verify your identity before responding to a
                request involving your account or personal information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0d3b2e]">
                10. Marketing Communications
              </h2>

              <p className="mt-3">
                Service-related communications may be necessary for your use
                of RentSpace.
              </p>

              <p className="mt-3">
                Promotional communications, where offered, will be handled
                separately from the consent required to create an account.
              </p>

              <p className="mt-3">
                You may opt out of promotional communications where applicable
                without necessarily closing your RentSpace account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0d3b2e]">
                11. Children's Information
              </h2>

              <p className="mt-3">
                RentSpace is not intended to encourage children to provide
                personal information independently.
              </p>

              <p className="mt-3">
                Where applicable law requires parental or legal guardian
                involvement for the processing of a child's personal
                information, RentSpace will seek to follow those requirements.
              </p>

              <p className="mt-3">
                Zimbabwe's current data protection guidance specifically
                addresses children's personal information and recognises the
                need for legal guardian involvement where applicable.
                :contentReference[oaicite:3]{index=3}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0d3b2e]">
                12. Cookies and Technical Information
              </h2>

              <p className="mt-3">
                RentSpace may use cookies, local storage and similar technical
                mechanisms where necessary to provide functionality, maintain
                authentication, improve security and understand how the
                platform is used.
              </p>

              <p className="mt-3">
                We will provide additional information about non-essential
                tracking technologies where they are introduced.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0d3b2e]">
                13. Changes to This Policy
              </h2>

              <p className="mt-3">
                We may update this Privacy Policy when our services, technology
                or legal obligations change.
              </p>

              <p className="mt-3">
                The latest version will be made available on the RentSpace
                website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0d3b2e]">
                14. Contact Us
              </h2>

              <p className="mt-3">
                If you have a privacy question, request or complaint, please
                contact RentSpace using the official contact details published
                on the website.
              </p>

              <p className="mt-3">
                Before launch, replace this section with RentSpace's confirmed
                legal name, privacy contact email and other required contact
                details.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}