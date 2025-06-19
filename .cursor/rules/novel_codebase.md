# .cursor/rules/artifactsUI.md

```md
├── .env.example
├── .eslintrc.json
├── .gitignore
├── LICENSE
├── README.md
├── app
    ├── (auth)
    │   ├── forgot-password
    │   │   ├── form.tsx
    │   │   └── page.tsx
    │   ├── signin
    │   │   ├── form.tsx
    │   │   └── page.tsx
    │   └── signup
    │   │   ├── form.tsx
    │   │   └── page.tsx
    ├── api
    │   ├── auth
    │   │   ├── callback
    │   │   │   └── route.ts
    │   │   └── update-password
    │   │   │   └── route.ts
    │   └── chat
    │   │   ├── route.ts
    │   │   └── systemPrompt.ts
    ├── chat
    │   └── [id]
    │   │   └── page.tsx
    ├── favicon.ico
    ├── globals.css
    ├── layout.tsx
    ├── new
    │   └── page.tsx
    ├── not-found.tsx
    ├── page.tsx
    ├── react-query-provider.tsx
    ├── supabase.types.ts
    └── types.ts
├── components.json
├── components
    ├── artifact
    │   ├── html.tsx
    │   ├── index.tsx
    │   └── react.tsx
    ├── auth-form-footers.tsx
    ├── chat
    │   ├── attachment-preview-button.tsx
    │   ├── input.tsx
    │   ├── message-list.tsx
    │   ├── message.tsx
    │   └── panel.tsx
    ├── homepage-link.tsx
    ├── markdown
    │   ├── code-block.tsx
    │   ├── markdown.tsx
    │   └── memoized-react-markdownn.tsx
    ├── oauth-provider-button.tsx
    ├── selection-tool.tsx
    ├── side-navbar
    │   ├── chat-item.tsx
    │   ├── index.tsx
    │   └── user-settings.tsx
    ├── social-footer.tsx
    ├── ui
    │   ├── alert-dialog.tsx
    │   ├── button.tsx
    │   ├── card.tsx
    │   ├── dialog.tsx
    │   ├── dropdown-menu.tsx
    │   ├── form.tsx
    │   ├── index.ts
    │   ├── input.tsx
    │   ├── label.tsx
    │   ├── popover.tsx
    │   ├── select.tsx
    │   ├── separator.tsx
    │   ├── tabs.tsx
    │   ├── textarea.tsx
    │   └── tooltip.tsx
    └── user-button
    │   ├── index.tsx
    │   └── sign-out-dialog.tsx
├── lib
    ├── db.ts
    ├── hooks
    │   ├── use-copy-to-clipboard.ts
    │   ├── use-enter-submit.ts
    │   ├── use-fake-whisper.ts
    │   └── use-scroll-anchor.ts
    ├── sampleMessages.ts
    ├── supabase
    │   ├── hooks
    │   │   └── useSupabase.ts
    │   ├── index.ts
    │   ├── supabase-provider.tsx
    │   └── types.ts
    ├── userSettings.ts
    └── utils.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
    ├── anthropic.svg
    ├── crop-and-talk.png
    ├── demo.png
    ├── github.svg
    ├── google.svg
    ├── next.svg
    ├── openai.svg
    └── vercel.svg
├── supabase
    ├── .gitignore
    ├── config.toml
    ├── migrations
    │   ├── 20240720132926_remote_schema.sql
    │   └── 20240720133004_remote_schema.sql
    └── seed.sql
├── tailwind.config.ts
└── tsconfig.json


/.env.example:
--------------------------------------------------------------------------------
1 | 
2 | NEXT_PUBLIC_SUPABASE_URL=
3 | NEXT_PUBLIC_SUPABASE_ANON_KEY=
4 | 
5 | NEXT_PUBLIC_ARTIFACT_RENDERER_URL=http://localhost:3001


--------------------------------------------------------------------------------
/.eslintrc.json:
--------------------------------------------------------------------------------
1 | {
2 |   "extends": "next/core-web-vitals"
3 | }
4 | 


--------------------------------------------------------------------------------
/.gitignore:
--------------------------------------------------------------------------------
 1 | # See https://help.github.com/articles/ignoring-files/ for more about ignoring files.
 2 | 
 3 | # dependencies
 4 | /node_modules
 5 | /.pnp
 6 | .pnp.js
 7 | .yarn/install-state.gz
 8 | 
 9 | # testing
10 | /coverage
11 | 
12 | # next.js
13 | /.next/
14 | /out/
15 | 
16 | # production
17 | /build
18 | 
19 | # misc
20 | .DS_Store
21 | *.pem
22 | 
23 | # debug
24 | npm-debug.log*
25 | yarn-debug.log*
26 | yarn-error.log*
27 | 
28 | # local env files
29 | .env*.local
30 | 
31 | # vercel
32 | .vercel
33 | 
34 | # typescript
35 | *.tsbuildinfo
36 | next-env.d.ts
37 | 


--------------------------------------------------------------------------------
/LICENSE:
--------------------------------------------------------------------------------
 1 | MIT License
 2 | 
 3 | Copyright (c) 2024 Bharath Sriraam Ramasubbu Raja
 4 | 
 5 | Permission is hereby granted, free of charge, to any person obtaining a copy
 6 | of this software and associated documentation files (the "Software"), to deal
 7 | in the Software without restriction, including without limitation the rights
 8 | to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 9 | copies of the Software, and to permit persons to whom the Software is
10 | furnished to do so, subject to the following conditions:
11 | 
12 | The above copyright notice and this permission notice shall be included in all
13 | copies or substantial portions of the Software.
14 | 
15 | THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
16 | IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
17 | FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
18 | AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
19 | LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
20 | OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
21 | SOFTWARE.
22 | 


--------------------------------------------------------------------------------
/README.md:
--------------------------------------------------------------------------------
  1 | # 🦉 Open Artifacts
  2 | 
  3 | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![Shadcn](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
  4 | 
  5 | ![Open Artifacts Demo](public/demo.png)
  6 | ![Open Artifacts Demo 2](public/crop-and-talk.png)
  7 | 
  8 | Open Artifacts is a free, open-source project that clones the functionality of [Claude](https://claude.ai) while supporting the generation of Artifacts with [Anthropic](https://www.anthropic.com/) and [OpenAI](https://openai.com/) LLMs using the user's API keys.
  9 | 
 10 | The Artifact viewer is implemented using [Open Artifacts Renderer](https://github.com/13point5/open-artifacts-renderer).
 11 | 
 12 | ## Features
 13 | 
 14 | - 🎨 Generate Artifacts with [Anthropic](https://www.anthropic.com/) and [OpenAI](https://openai.com/) LLMs
 15 | - 📸 Crop and 🔊 Talk to iteratively edit Artifacts
 16 | - 🎛️ Utilizes user's API keys for interactions
 17 | 
 18 | ## Tech Stack
 19 | 
 20 | - [Next.js](https://nextjs.org/) - React framework
 21 | - [Supabase](https://supabase.io/) - Database and Auth System
 22 | - [Claude API](https://www.anthropic.com/) - LLM API
 23 | - [shadcn/ui](https://ui.shadcn.com/) - Component Library
 24 | - [Vercel AI SDK](https://sdk.vercel.ai/docs/introduction) - Toolkit for building AI-powered applications
 25 | 
 26 | ## Getting Started
 27 | 
 28 | 1. Clone the repository:
 29 | 
 30 |    \`\`\`
 31 |    git clone https://github.com/13point5/open-artifacts.git
 32 |    \`\`\`
 33 | 
 34 | 1. Navigate to the project directory:
 35 | 
 36 |    \`\`\`
 37 |    cd open-artifacts
 38 |    \`\`\`
 39 | 
 40 | ### Supabase Setup
 41 | 
 42 | 1. Install the [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started#installing-the-supabase-cli)
 43 | 
 44 | 1. Create a Supabase project
 45 | 
 46 | 1. Initialize Supabase locally
 47 | 
 48 |    \`\`\`
 49 |    supabase init
 50 |    \`\`\`
 51 | 
 52 | 1. Link your local project to your remote Supabase project
 53 | 
 54 |    \`\`\`
 55 |    supabase link --project-ref <your-project-ref>
 56 |    \`\`\`
 57 | 
 58 | 1. Apply Migrations
 59 | 
 60 |    \`\`\`
 61 |    supabase db push
 62 |    \`\`\`
 63 | 
 64 | 1. Copy env variables from your Supabase project
 65 | 
 66 |    \`\`\`
 67 |    NEXT_PUBLIC_SUPABASE_URL=
 68 |    NEXT_PUBLIC_SUPABASE_ANON_KEY=
 69 |    \`\`\`
 70 | 
 71 | ### App Setup
 72 | 
 73 | 1. Install dependencies:
 74 | 
 75 |    \`\`\`
 76 |    npm install
 77 |    \`\`\`
 78 | 
 79 | 1. Run the development server:
 80 | 
 81 |    \`\`\`
 82 |    npm run dev
 83 |    \`\`\`
 84 | 
 85 | 1. Setup [Open Artifacts Renderer](https://github.com/13point5/open-artifacts-renderer) and set the `NEXT_PUBLIC_ARTIFACT_RENDERER_URL` env variable to the URL of the renderer.
 86 | 
 87 |    \`\`\`
 88 |    NEXT_PUBLIC_ARTIFACT_RENDERER_URL=
 89 |    \`\`\`
 90 | 
 91 | 1. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.
 92 | 
 93 | ## License
 94 | 
 95 | This project is licensed under the [MIT License](LICENSE).
 96 | 
 97 | ## Acknowledgments
 98 | 
 99 | - Inspired by [prompt2ui](https://github.com/sullyo/prompt2ui) by [sullyo](https://github.com/sullyo), from which code has been used in this project
100 | - Anthropic for the Claude API and for doubling the token limit
101 | - The open-source community for the amazing tools and libraries used in this project
102 | 


--------------------------------------------------------------------------------
/app/(auth)/forgot-password/form.tsx:
--------------------------------------------------------------------------------
  1 | "use client";
  2 | 
  3 | import { Button } from "@/components/ui/button";
  4 | import {
  5 |   Card,
  6 |   CardContent,
  7 |   CardDescription,
  8 |   CardFooter,
  9 |   CardHeader,
 10 |   CardTitle,
 11 | } from "@/components/ui/card";
 12 | import {
 13 |   Form,
 14 |   FormControl,
 15 |   FormField,
 16 |   FormItem,
 17 |   FormLabel,
 18 |   FormMessage,
 19 | } from "@/components/ui/form";
 20 | import { Input } from "@/components/ui/input";
 21 | import { useForm } from "react-hook-form";
 22 | import { zodResolver } from "@hookform/resolvers/zod";
 23 | 
 24 | import * as z from "zod";
 25 | import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
 26 | import { useState } from "react";
 27 | import { Loader2Icon } from "lucide-react";
 28 | import toast from "react-hot-toast";
 29 | import { SignInFooter, SignUpFooter } from "@/components/auth-form-footers";
 30 | import { SocialFooter } from "@/components/social-footer";
 31 | import Link from "next/link";
 32 | 
 33 | const formSchema = z.object({
 34 |   email: z.string(),
 35 | });
 36 | 
 37 | enum FormStatus {
 38 |   Idle,
 39 |   Loading,
 40 |   Error,
 41 |   Success,
 42 | }
 43 | 
 44 | const ForgotPasswordForm = () => {
 45 |   const supabase = createClientComponentClient();
 46 | 
 47 |   const form = useForm<z.infer<typeof formSchema>>({
 48 |     resolver: zodResolver(formSchema),
 49 |     defaultValues: {
 50 |       email: "",
 51 |     },
 52 |   });
 53 | 
 54 |   // state for signin progress, error, and success
 55 |   const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.Idle);
 56 | 
 57 |   const onSubmit = async (values: z.infer<typeof formSchema>) => {
 58 |     setFormStatus(FormStatus.Loading);
 59 | 
 60 |     const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
 61 |       redirectTo: `${window.location.origin}/api/auth/update-password`,
 62 |     });
 63 | 
 64 |     if (error) {
 65 |       console.error(error);
 66 |       setFormStatus(FormStatus.Error);
 67 |       toast.error(error.message, {
 68 |         position: "bottom-center",
 69 |       });
 70 |       return;
 71 |     }
 72 | 
 73 |     setFormStatus(FormStatus.Success);
 74 |     toast.success("Password reset instructions sent to your email", {
 75 |       position: "bottom-center",
 76 |     });
 77 |   };
 78 | 
 79 |   return (
 80 |     <main className="flex flex-col gap-6 items-center w-full h-screen pt-8 px-4">
 81 |       <Link href="/">
 82 |         <h1 className="text-4xl font-bold">Open Artifacts</h1>
 83 |       </Link>
 84 |       <Card className="max-w-sm w-full">
 85 |         <CardHeader className="space-y-1">
 86 |           <CardTitle className="text-2xl">Reset Password</CardTitle>
 87 |           <CardDescription>
 88 |             We will send you instructions to update your password if you have
 89 |             used this email to sign up
 90 |           </CardDescription>
 91 |         </CardHeader>
 92 | 
 93 |         <Form {...form}>
 94 |           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
 95 |             <CardContent className="grid gap-6">
 96 |               <FormField
 97 |                 control={form.control}
 98 |                 name="email"
 99 |                 render={({ field }) => (
100 |                   <FormItem>
101 |                     <FormLabel>Email</FormLabel>
102 |                     <FormControl>
103 |                       <Input placeholder="you@email.com" {...field} />
104 |                     </FormControl>
105 |                     <FormMessage />
106 |                   </FormItem>
107 |                 )}
108 |               />
109 | 
110 |               <Button type="submit" className="w-full">
111 |                 {formStatus === FormStatus.Loading && (
112 |                   <>
113 |                     <Loader2Icon className="animate-spin mr-2" /> Sending
114 |                     Instructions
115 |                   </>
116 |                 )}
117 | 
118 |                 {formStatus !== FormStatus.Loading && "Send Instructions"}
119 |               </Button>
120 |             </CardContent>
121 | 
122 |             <CardFooter className="flex flex-col gap-2">
123 |               <SignInFooter />
124 |               <SignUpFooter />
125 |             </CardFooter>
126 |           </form>
127 |         </Form>
128 |       </Card>
129 | 
130 |       <SocialFooter />
131 |     </main>
132 |   );
133 | };
134 | 
135 | export default ForgotPasswordForm;
136 | 


--------------------------------------------------------------------------------
/app/(auth)/forgot-password/page.tsx:
--------------------------------------------------------------------------------
 1 | import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
 2 | import { cookies } from "next/headers";
 3 | import { redirect } from "next/navigation";
 4 | import Form from "./form";
 5 | 
 6 | const ForgotPasswordPage = async () => {
 7 |   const supabase = createServerComponentClient({ cookies });
 8 | 
 9 |   const {
10 |     data: { user },
11 |   } = await supabase.auth.getUser();
12 | 
13 |   if (user) {
14 |     redirect("/new");
15 |   }
16 | 
17 |   return <Form />;
18 | };
19 | 
20 | export default ForgotPasswordPage;
21 | 


--------------------------------------------------------------------------------
/app/(auth)/signin/form.tsx:
--------------------------------------------------------------------------------
  1 | "use client";
  2 | 
  3 | import { Button } from "@/components/ui/button";
  4 | import {
  5 |   Card,
  6 |   CardContent,
  7 |   CardFooter,
  8 |   CardHeader,
  9 |   CardTitle,
 10 | } from "@/components/ui/card";
 11 | import {
 12 |   Form,
 13 |   FormControl,
 14 |   FormField,
 15 |   FormItem,
 16 |   FormLabel,
 17 |   FormMessage,
 18 | } from "@/components/ui/form";
 19 | import { Input } from "@/components/ui/input";
 20 | import { useForm } from "react-hook-form";
 21 | import { zodResolver } from "@hookform/resolvers/zod";
 22 | 
 23 | import * as z from "zod";
 24 | import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
 25 | import { useState } from "react";
 26 | import { Loader2Icon } from "lucide-react";
 27 | import toast from "react-hot-toast";
 28 | import {
 29 |   ForgotPasswordFooter,
 30 |   SignUpFooter,
 31 | } from "@/components/auth-form-footers";
 32 | import { SocialFooter } from "@/components/social-footer";
 33 | import Link from "next/link";
 34 | import { Separator } from "@/components/ui/separator";
 35 | import { OAuthProviderButton } from "@/components/oauth-provider-button";
 36 | import { OAuthProviders } from "@/app/types";
 37 | 
 38 | const formSchema = z.object({
 39 |   email: z.string(),
 40 |   password: z.string(),
 41 | });
 42 | 
 43 | enum FormStatus {
 44 |   Idle,
 45 |   Loading,
 46 |   Error,
 47 |   Success,
 48 | }
 49 | 
 50 | const SignInForm = () => {
 51 |   const supabase = createClientComponentClient();
 52 | 
 53 |   const form = useForm<z.infer<typeof formSchema>>({
 54 |     resolver: zodResolver(formSchema),
 55 |     defaultValues: {
 56 |       email: "",
 57 |       password: "",
 58 |     },
 59 |   });
 60 | 
 61 |   // state for signin progress, error, and success
 62 |   const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.Idle);
 63 | 
 64 |   const onSubmit = async (values: z.infer<typeof formSchema>) => {
 65 |     setFormStatus(FormStatus.Loading);
 66 | 
 67 |     const res = await supabase.auth.signInWithPassword({
 68 |       email: values.email,
 69 |       password: values.password,
 70 |     });
 71 | 
 72 |     if (res.error) {
 73 |       console.error(res.error);
 74 |       setFormStatus(FormStatus.Error);
 75 |       toast.error("Could not Sign In", {
 76 |         position: "bottom-center",
 77 |       });
 78 |       return;
 79 |     }
 80 | 
 81 |     setFormStatus(FormStatus.Success);
 82 |     toast.success("Signed In! Taking you to the app", {
 83 |       position: "bottom-center",
 84 |     });
 85 |   };
 86 | 
 87 |   const handleOAuthSignIn = async (provider: OAuthProviders) => {
 88 |     const { error } = await supabase.auth.signInWithOAuth({
 89 |       provider,
 90 |       options: {
 91 |         redirectTo: `${window.location.origin}/api/auth/callback`,
 92 |       },
 93 |     });
 94 | 
 95 |     if (error) {
 96 |       console.error(error);
 97 |       toast.error("Could not Sign In", {
 98 |         position: "top-right",
 99 |       });
100 |     }
101 |   };
102 | 
103 |   const handleGoogleSignIn = () => {
104 |     handleOAuthSignIn(OAuthProviders.google);
105 |   };
106 | 
107 |   const handleGitHubSignIn = () => {
108 |     handleOAuthSignIn(OAuthProviders.github);
109 |   };
110 | 
111 |   return (
112 |     <main className="flex flex-col gap-6 items-center w-full h-screen pt-8 px-4">
113 |       <Link href="/">
114 |         <h1 className="text-4xl font-bold">Open Artifacts</h1>
115 |       </Link>
116 |       <Card className="max-w-sm w-full">
117 |         <CardHeader className="space-y-1">
118 |           <CardTitle className="text-2xl">Sign In</CardTitle>
119 |         </CardHeader>
120 | 
121 |         <CardContent className="grid gap-4">
122 |           <OAuthProviderButton
123 |             provider={OAuthProviders.google}
124 |             onClick={handleGoogleSignIn}
125 |           >
126 |             Sign in with Google
127 |           </OAuthProviderButton>
128 | 
129 |           <OAuthProviderButton
130 |             provider={OAuthProviders.github}
131 |             onClick={handleGitHubSignIn}
132 |           >
133 |             Sign in with GitHub
134 |           </OAuthProviderButton>
135 | 
136 |           <div className="flex items-center gap-4">
137 |             <Separator className="flex-1" />
138 |             <span className="text-neutral-500 text-sm">OR</span>
139 |             <Separator className="flex-1" />
140 |           </div>
141 | 
142 |           <Form {...form}>
143 |             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
144 |               <FormField
145 |                 control={form.control}
146 |                 name="email"
147 |                 render={({ field }) => (
148 |                   <FormItem>
149 |                     <FormLabel>Email</FormLabel>
150 |                     <FormControl>
151 |                       <Input placeholder="you@email.com" {...field} />
152 |                     </FormControl>
153 |                     <FormMessage />
154 |                   </FormItem>
155 |                 )}
156 |               />
157 | 
158 |               <FormField
159 |                 control={form.control}
160 |                 name="password"
161 |                 render={({ field }) => (
162 |                   <FormItem>
163 |                     <FormLabel>Password</FormLabel>
164 |                     <FormControl>
165 |                       <Input type="password" {...field} />
166 |                     </FormControl>
167 |                     <FormMessage />
168 |                   </FormItem>
169 |                 )}
170 |               />
171 | 
172 |               <Button type="submit" className="w-full">
173 |                 {formStatus === FormStatus.Loading && (
174 |                   <>
175 |                     <Loader2Icon className="animate-spin mr-2" /> Signing In
176 |                   </>
177 |                 )}
178 | 
179 |                 {formStatus !== FormStatus.Loading && "Sign In"}
180 |               </Button>
181 |             </form>
182 |           </Form>
183 |         </CardContent>
184 | 
185 |         <CardFooter className="flex flex-col gap-2">
186 |           <ForgotPasswordFooter />
187 |           <SignUpFooter />
188 |         </CardFooter>
189 |       </Card>
190 | 
191 |       <SocialFooter />
192 |     </main>
193 |   );
194 | };
195 | 
196 | export default SignInForm;
197 | 


--------------------------------------------------------------------------------
/app/(auth)/signin/page.tsx:
--------------------------------------------------------------------------------
 1 | import SignInForm from "./form";
 2 | import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
 3 | import { cookies } from "next/headers";
 4 | import { redirect } from "next/navigation";
 5 | 
 6 | const SignInPage = async () => {
 7 |   const supabase = createServerComponentClient({ cookies });
 8 | 
 9 |   const {
10 |     data: { user },
11 |   } = await supabase.auth.getUser();
12 | 
13 |   if (user) {
14 |     redirect("/new");
15 |   }
16 | 
17 |   return <SignInForm />;
18 | };
19 | 
20 | export default SignInPage;
21 | 


--------------------------------------------------------------------------------
/app/(auth)/signup/form.tsx:
--------------------------------------------------------------------------------
  1 | "use client";
  2 | 
  3 | import { useState } from "react";
  4 | import { Button } from "@/components/ui/button";
  5 | import {
  6 |   Card,
  7 |   CardContent,
  8 |   CardFooter,
  9 |   CardHeader,
 10 |   CardTitle,
 11 | } from "@/components/ui/card";
 12 | import {
 13 |   Form,
 14 |   FormControl,
 15 |   FormField,
 16 |   FormItem,
 17 |   FormLabel,
 18 |   FormMessage,
 19 | } from "@/components/ui/form";
 20 | import { Input } from "@/components/ui/input";
 21 | import { useForm } from "react-hook-form";
 22 | import { zodResolver } from "@hookform/resolvers/zod";
 23 | 
 24 | import * as z from "zod";
 25 | import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
 26 | import { SignInFooter } from "@/components/auth-form-footers";
 27 | import toast from "react-hot-toast";
 28 | import { Loader2Icon } from "lucide-react";
 29 | import { SocialFooter } from "@/components/social-footer";
 30 | import Link from "next/link";
 31 | import { Separator } from "@/components/ui/separator";
 32 | import { OAuthProviderButton } from "@/components/oauth-provider-button";
 33 | import { OAuthProviders } from "@/app/types";
 34 | 
 35 | enum FormStatus {
 36 |   Idle,
 37 |   Loading,
 38 |   Error,
 39 |   Success,
 40 | }
 41 | 
 42 | const formSchema = z.object({
 43 |   full_name: z.string(),
 44 |   email: z.string(),
 45 |   password: z.string(),
 46 | });
 47 | 
 48 | const SignUpForm = () => {
 49 |   const supabase = createClientComponentClient();
 50 | 
 51 |   const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.Idle);
 52 |   const form = useForm<z.infer<typeof formSchema>>({
 53 |     resolver: zodResolver(formSchema),
 54 |     defaultValues: {
 55 |       full_name: "",
 56 |       email: "",
 57 |       password: "",
 58 |     },
 59 |   });
 60 | 
 61 |   const onSubmit = async (values: z.infer<typeof formSchema>) => {
 62 |     setFormStatus(FormStatus.Loading);
 63 | 
 64 |     const { error } = await supabase.auth.signUp({
 65 |       email: values.email,
 66 |       password: values.password,
 67 |       options: {
 68 |         data: {
 69 |           full_name: values.full_name,
 70 |         },
 71 |         emailRedirectTo: `${location.origin}/api/auth/callback`,
 72 |       },
 73 |     });
 74 | 
 75 |     if (error) {
 76 |       console.error(error);
 77 |       setFormStatus(FormStatus.Error);
 78 |       toast.error(error.message, {
 79 |         position: "bottom-center",
 80 |       });
 81 | 
 82 |       return;
 83 |     }
 84 | 
 85 |     toast.success("Check your email for the confirmation link", {
 86 |       position: "bottom-center",
 87 |     });
 88 |     setFormStatus(FormStatus.Success);
 89 |   };
 90 | 
 91 |   const handleOAuthSignIn = async (provider: OAuthProviders) => {
 92 |     const { error } = await supabase.auth.signInWithOAuth({
 93 |       provider,
 94 |       options: {
 95 |         redirectTo: `${window.location.origin}/api/auth/callback`,
 96 |       },
 97 |     });
 98 | 
 99 |     if (error) {
100 |       console.error(error);
101 |       toast.error("Could not Sign In", {
102 |         position: "top-right",
103 |       });
104 |     }
105 |   };
106 | 
107 |   const handleGoogleSignIn = () => {
108 |     handleOAuthSignIn(OAuthProviders.google);
109 |   };
110 | 
111 |   const handleGitHubSignIn = () => {
112 |     handleOAuthSignIn(OAuthProviders.github);
113 |   };
114 | 
115 |   return (
116 |     <main className="flex flex-col gap-6 items-center w-full h-screen pt-8 px-4">
117 |       <Link href="/">
118 |         <h1 className="text-4xl font-bold">Open Artifacts</h1>
119 |       </Link>
120 | 
121 |       <Card className="max-w-sm w-full">
122 |         <CardHeader className="space-y-1">
123 |           <CardTitle className="text-2xl">Create an account</CardTitle>
124 |         </CardHeader>
125 | 
126 |         <CardContent className="grid gap-4">
127 |           <OAuthProviderButton
128 |             provider={OAuthProviders.google}
129 |             onClick={handleGoogleSignIn}
130 |           >
131 |             Sign up with Google
132 |           </OAuthProviderButton>
133 | 
134 |           <OAuthProviderButton
135 |             provider={OAuthProviders.github}
136 |             onClick={handleGitHubSignIn}
137 |           >
138 |             Sign in with GitHub
139 |           </OAuthProviderButton>
140 | 
141 |           <div className="flex items-center gap-4">
142 |             <Separator className="flex-1" />
143 |             <span className="text-neutral-500 text-sm">OR</span>
144 |             <Separator className="flex-1" />
145 |           </div>
146 | 
147 |           <Form {...form}>
148 |             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
149 |               <FormField
150 |                 control={form.control}
151 |                 name="full_name"
152 |                 render={({ field }) => (
153 |                   <FormItem>
154 |                     <FormLabel>Name</FormLabel>
155 |                     <FormControl>
156 |                       <Input placeholder="Your Name" {...field} />
157 |                     </FormControl>
158 |                     <FormMessage />
159 |                   </FormItem>
160 |                 )}
161 |               />
162 | 
163 |               <FormField
164 |                 control={form.control}
165 |                 name="email"
166 |                 render={({ field }) => (
167 |                   <FormItem>
168 |                     <FormLabel>Email</FormLabel>
169 |                     <FormControl>
170 |                       <Input placeholder="you@email.com" {...field} />
171 |                     </FormControl>
172 |                     <FormMessage />
173 |                   </FormItem>
174 |                 )}
175 |               />
176 | 
177 |               <FormField
178 |                 control={form.control}
179 |                 name="password"
180 |                 render={({ field }) => (
181 |                   <FormItem>
182 |                     <FormLabel>Password</FormLabel>
183 |                     <FormControl>
184 |                       <Input type="password" {...field} />
185 |                     </FormControl>
186 |                     <FormMessage />
187 |                   </FormItem>
188 |                 )}
189 |               />
190 | 
191 |               <Button type="submit" className="w-full">
192 |                 {formStatus === FormStatus.Loading && (
193 |                   <>
194 |                     <Loader2Icon className="animate-spin mr-2" /> Signing up
195 |                   </>
196 |                 )}
197 | 
198 |                 {formStatus !== FormStatus.Loading && "Sign Up"}
199 |               </Button>
200 |             </form>
201 |           </Form>
202 |         </CardContent>
203 | 
204 |         <CardFooter className="flex items-center justify-center">
205 |           <SignInFooter />
206 |         </CardFooter>
207 |       </Card>
208 | 
209 |       <SocialFooter />
210 |     </main>
211 |   );
212 | };
213 | 
214 | export default SignUpForm;
215 | 


--------------------------------------------------------------------------------
/app/(auth)/signup/page.tsx:
--------------------------------------------------------------------------------
 1 | import SignUpForm from "./form";
 2 | import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
 3 | import { cookies } from "next/headers";
 4 | import { redirect } from "next/navigation";
 5 | 
 6 | const SignUpPage = async () => {
 7 |   const supabase = createServerComponentClient({ cookies });
 8 | 
 9 |   const {
10 |     data: { user },
11 |   } = await supabase.auth.getUser();
12 | 
13 |   if (user) {
14 |     redirect("/new");
15 |   }
16 | 
17 |   return <SignUpForm />;
18 | };
19 | 
20 | export default SignUpPage;
21 | 


--------------------------------------------------------------------------------
/app/api/auth/callback/route.ts:
--------------------------------------------------------------------------------
 1 | import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
 2 | import { cookies } from "next/headers";
 3 | import { NextResponse } from "next/server";
 4 | 
 5 | export const dynamic = "force-dynamic";
 6 | 
 7 | export async function GET(request: Request) {
 8 |   // The `/auth/callback` route is required for the server-side auth flow implemented
 9 |   // by the Auth Helpers package. It exchanges an auth code for the user's session.
10 |   // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-sign-in-with-code-exchange
11 |   const { searchParams, origin } = new URL(request.url);
12 |   const code = searchParams.get("code");
13 |   // if "next" is in param, use it as the redirect URL
14 |   const next = searchParams.get("next") ?? "/";
15 | 
16 |   if (code) {
17 |     const supabase = createRouteHandlerClient({ cookies });
18 |     const { error } = await supabase.auth.exchangeCodeForSession(code);
19 | 
20 |     if (!error) {
21 |       return NextResponse.redirect(`${origin}${next}`);
22 |     }
23 |   }
24 | 
25 |   // URL to redirect to after sign in process completes
26 |   return NextResponse.redirect(origin);
27 | }
28 | 


--------------------------------------------------------------------------------
/app/api/auth/update-password/route.ts:
--------------------------------------------------------------------------------
 1 | import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
 2 | import { cookies } from "next/headers";
 3 | import { NextResponse } from "next/server";
 4 | 
 5 | export async function GET(request: Request) {
 6 |   const requestUrl = new URL(request.url);
 7 |   const code = requestUrl.searchParams.get("code");
 8 | 
 9 |   if (code) {
10 |     const supabase = createRouteHandlerClient({ cookies });
11 |     await supabase.auth.exchangeCodeForSession(code);
12 | 
13 |     return NextResponse.redirect(`${requestUrl.origin}/update-password`);
14 |   }
15 | 
16 |   // eslint-disable-next-line no-console
17 |   console.error("ERROR: Invalid auth code or no auth code found");
18 | 
19 |   return NextResponse.redirect(`${requestUrl.origin}/signin`);
20 | }
21 | 


--------------------------------------------------------------------------------
/app/api/chat/route.ts:
--------------------------------------------------------------------------------
 1 | import { ArtifactoSystemPrompt } from "@/app/api/chat/systemPrompt";
 2 | import { createAnthropic } from "@ai-sdk/anthropic";
 3 | import { streamText, convertToCoreMessages, Message, ImagePart } from "ai";
 4 | import { createOpenAI } from "@ai-sdk/openai";
 5 | import { Models } from "@/app/types";
 6 | 
 7 | export const maxDuration = 60;
 8 | 
 9 | export async function POST(req: Request) {
10 |   const { messages, apiKey, model } = await req.json();
11 | 
12 |   let llm;
13 |   let options: Record<string, any> = {};
14 | 
15 |   if (model === Models.claude) {
16 |     const anthropic = createAnthropic({
17 |       apiKey,
18 |     });
19 | 
20 |     llm = anthropic("claude-3-5-sonnet-20240620");
21 | 
22 |     options = {
23 |       ...options,
24 |       maxTokens: 8192,
25 |       headers: {
26 |         ...(options.headers || {}),
27 |         "anthropic-beta": "max-tokens-3-5-sonnet-2024-07-15",
28 |       },
29 |     };
30 |   } else if (model.startsWith("gpt")) {
31 |     const openai = createOpenAI({
32 |       compatibility: "strict", // strict mode, enable when using the OpenAI API
33 |       apiKey,
34 |     });
35 | 
36 |     llm = openai(model);
37 |   }
38 | 
39 |   if (!llm) throw new Error(`Unsupported model: ${model}`);
40 | 
41 |   const initialMessages = messages.slice(0, -1);
42 |   const currentMessage: Message = messages[messages.length - 1];
43 |   const attachments = currentMessage.experimental_attachments || [];
44 |   const imageParts: ImagePart[] = attachments.map((file) => ({
45 |     type: "image",
46 |     image: new URL(file.url),
47 |   }));
48 | 
49 |   const result = await streamText({
50 |     model: llm,
51 |     messages: [
52 |       ...convertToCoreMessages(initialMessages),
53 |       {
54 |         role: "user",
55 |         content: [
56 |           {
57 |             type: "text",
58 |             text: currentMessage.content,
59 |           },
60 |           ...imageParts,
61 |         ],
62 |       },
63 |     ],
64 |     system: ArtifactoSystemPrompt,
65 |     ...options,
66 |   });
67 | 
68 |   return result.toAIStreamResponse();
69 | }
70 | 


--------------------------------------------------------------------------------
/app/api/chat/systemPrompt.ts:
--------------------------------------------------------------------------------
  1 | export const ArtifactoSystemPrompt = `
  2 | You are Artifacto, a helpful assistant.
  3 | 
  4 | You cannot open URLs, links, or videos. If it seems like the user is expecting you to do so, you clarify the situation and ask the human to paste the relevant text or image content directly into the conversation.
  5 | 
  6 | If you are asked to assist with tasks involving the expression of views held by a significant number of people, you provide assistance with the task regardless of your own views. If asked about controversial topics, you try to provide careful thoughts and clear information. You present the requested information without explicitly saying that the topic is sensitive, and without claiming to be presenting objective facts.
  7 | 
  8 | You are happy to help with analysis, question answering, math, coding, creative writing, teaching, general discussion, and all sorts of other tasks.
  9 | 
 10 | When presented with a math problem, logic problem, or other problem benefiting from systematic thinking, you think through it step by step before giving your final answer.
 11 | 
 12 | If you cannot or will not perform a task, you tell the user this without apologizing to them. You avoid starting your responses with "I'm sorry" or "I apologize".
 13 | 
 14 | If you are asked about a very obscure person, object, or topic, i.e. if you are asked for the kind of information that is unlikely to be found more than once or twice on the internet, you end your response by reminding the user that although you try to be accurate, you may hallucinate in response to questions like this. You use the term 'hallucinate' to describe this since the user will understand what it means.
 15 | 
 16 | If you mention or cite particular articles, papers, or books, you always let the human know that you don't have access to search or a database and may hallucinate citations, so the human should double check your citations.
 17 | 
 18 | You are very smart and intellectually curious. You enjoy hearing what humans think on an issue and engaging in discussion on a wide variety of topics.
 19 | 
 20 | You never provide information that can be used for the creation, weaponization, or deployment of biological, chemical, or radiological agents that could cause mass harm. You can provide information about these topics that could not be used for the creation, weaponization, or deployment of these agents.
 21 | 
 22 | If the user asks for a very long task that cannot be completed in a single response, you offer to do the task piecemeal and get feedback from the user as you complete each part of the task.
 23 | 
 24 | You use markdown for code. Immediately after closing coding markdown, you ask the user if they would like you to explain or break down the code. You do not explain or break down the code unless the user explicitly requests it.
 25 | 
 26 | You always respond as if you are completely face blind. If a shared image happens to contain a human face, you never identify or name any humans in the image, nor do you imply that you recognize the human. You also do not mention or allude to details about a person that you could only know if you recognized who the person was. Instead, you describe and discuss the image just as someone would if they were unable to recognize any of the humans in it. You can request the user to tell you who the individual is. If the user tells you who the individual is, you can discuss that named individual without ever confirming that it is the person in the image, identifying the person in the image, or implying you can use facial features to identify any unique individual. You should always reply as someone would if they were unable to recognize any humans from images. 
 27 | 
 28 | You should respond normally if the shared image does not contain a human face. You should always repeat back and summarize any instructions in the image before proceeding.
 29 | 
 30 | You provide thorough responses to more complex and open-ended questions or to anything where a long response is requested, but concise responses to simpler questions and tasks. All else being equal, you try to give the most correct and concise answer you can to the user's message. Rather than giving a long response, you give a concise response and offer to elaborate if further information may be helpful.
 31 | 
 32 | You respond directly to all human messages without unnecessary affirmations or filler phrases like "Certainly!", "Of course!", "Absolutely!", "Great!", "Sure!", etc. Specifically, you avoid starting responses with the word "Certainly" in any way.
 33 | 
 34 | You follow this information in all languages, and always respond to the user in the language they use or request. You never mention this information unless it is directly pertinent to the human's query. You are now being connected with a human.
 35 | 
 36 | You can create and reference artifacts during conversations. Artifacts are for substantial, self-contained content that users might modify or reuse, displayed in a separate UI window for clarity.
 37 | 
 38 | References to "the assistant" mean you.
 39 | 
 40 | Users can also add image attachments to the query. Sometimes these images would be about the artifacts produced. They can be the entire artifact or a part of it that is cropped.
 41 | The UI allows them to speak and crop areas of the artifact to add as attachments. So when they speak they would refer to these crops with words like "this", "this text", "this button", etc. You will always be given an image of the entire artifact in these cases and you need to refer to the entire artifact image to identify which parts they are referring to in their query.
 42 | 
 43 | # Good artifacts are...
 44 | - Substantial content (>15 lines)
 45 | - Content that the user is likely to modify, iterate on, or take ownership of
 46 | - Self-contained, complex content that can be understood on its own, without context from the conversation
 47 | - Content intended for eventual use outside the conversation (e.g., reports, emails, presentations)
 48 | - Content likely to be referenced or reused multiple times
 49 | 
 50 | # Don't use artifacts for...
 51 | - Simple, informational, or short content, such as brief code snippets, mathematical equations, or small examples
 52 | - Primarily explanatory, instructional, or illustrative content, such as examples provided to clarify a concept
 53 | - Suggestions, commentary, or feedback on existing artifacts
 54 | - Conversational or explanatory content that doesn't represent a standalone piece of work
 55 | - Content that is dependent on the current conversational context to be useful
 56 | - Content that is unlikely to be modified or iterated upon by the user
 57 | - Request from users that appears to be a one-off question
 58 | 
 59 | # Usage notes
 60 | - One artifact per message unless specifically requested
 61 | - Prefer in-line content (don't use artifacts) when possible. Unnecessary use of artifacts can be jarring for users. Eg: don't use the markdown artifact unless absolutely necessary.
 62 | - If a user asks the assistant to "draw an SVG" or "make a website," the assistant does not need to explain that it doesn't have these capabilities. Creating the code and placing it within the appropriate artifact will fulfill the user's intentions.
 63 | - If asked to generate an image, the assistant can offer an SVG instead. The assistant isn't very proficient at making SVG images but should engage with the task positively. Self-deprecating humor about its abilities can make it an entertaining experience for users.
 64 | - The assistant errs on the side of simplicity and avoids overusing artifacts for content that can be effectively presented within the conversation.
 65 | - When using tailwind classes DO NOT USE space-x- and space-y- classes and use flex with the gap for spacing, eg: instead of "space-x-4" "flex items-center gap-4"
 66 | - When generating code for artifacts DO NOT add backticks like a normal code block because the xml tag contains the language already
 67 |   eg: DO NOT USE \`\`\`javascript instead the language attribute should be used in the artifact xml tag
 68 | 
 69 |   When collaborating with the user on creating content that falls into compatible categories, the assistant should follow these steps:
 70 | 
 71 |   1. Briefly before invoking an artifact, think for one sentence in <thinking> tags about how it evaluates against the criteria for a good and bad artifact. Consider if the content would work just fine without an artifact. If it's artifact-worthy, in another sentence determine if it's a new artifact or an update to an existing one (most common). For updates, reuse the prior identifier.
 72 | 
 73 | Wrap the content in opening and closing <artifact> tags.
 74 | 
 75 | Assign an identifier to the identifier attribute of the opening <artifact> tag. For updates, reuse the prior identifier. For new artifacts, the identifier should be descriptive and relevant to the content, using kebab-case (e.g., "example-code-snippet"). This identifier will be used consistently throughout the artifact's lifecycle, even when updating or iterating on the artifact. 
 76 | 
 77 | Include a title attribute in the <artifact> tag to provide a brief title or description of the content.
 78 | 
 79 | Add a type attribute to the opening <artifact> tag to specify the type of content the artifact represents. Assign one of the following values to the type attribute:
 80 | 
 81 | - Code: "application/code"
 82 |   - Use for code snippets or scripts in any programming language.
 83 |   - Include the language name as the value of the language attribute (e.g., language="python").
 84 |   - Do not use triple backticks when putting code in an artifact.
 85 | - Documents: "text/markdown"
 86 |   - Plain text, Markdown, or other formatted text documents
 87 | - HTML: "text/html" 
 88 |   - The user interface can render single file HTML pages placed within the artifact tags. HTML, JS, and CSS should be in a single file when using the text/html type.
 89 |   - Images from the web are not allowed, but you can use placeholder images by specifying the width and height like so <img src="/api/placeholder/400/320" alt="placeholder" />
 90 |   - The only place external scripts can be imported from is https://cdnjs.cloudflare.com
 91 |   - It is inappropriate to use "text/html" when sharing snippets, code samples & example HTML or CSS code, as it would be rendered as a webpage and the source code would be obscured. The assistant should instead use "application/code" defined above.
 92 |   - If the assistant is unable to follow the above requirements for any reason, use "application/code" type for the artifact instead, which will not attempt to render the webpage.
 93 | - SVG: "image/svg+xml"
 94 |  - The user interface will render the Scalable Vector Graphics (SVG) image within the artifact tags. 
 95 |  - The assistant should specify the viewbox of the SVG rather than defining a width/height
 96 | - Mermaid Diagrams: "application/mermaid"
 97 |  - The user interface will render Mermaid diagrams placed within the artifact tags.
 98 |  - Do not put Mermaid code in a code block when using artifacts.
 99 | - React Components: "application/react"
100 |  - Use this for displaying either: React elements, e.g. <strong>Hello World!</strong>, React pure functional components, e.g. () => <strong>Hello World!</strong>, React functional components with Hooks, or React component classes
101 |  - When creating a React component, ensure it has no required props (or provide default values for all props) and use a default export.
102 |  - Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. h-[600px]).
103 |  - Base React is available to be imported. To use hooks, first import it at the top of the artifact, e.g. import { useState } from "react"
104 |  - The lucide-react@0.263.1 library is available to be imported. e.g. import { Camera } from "lucide-react" & <Camera color="red" size={48} />
105 |  - The recharts charting library is available to be imported, e.g. import { LineChart, XAxis, ... } from "recharts" & <LineChart ...><XAxis dataKey="name"> ...
106 |  - The assistant can use prebuilt components from the shadcn/ui library after it is imported: import { alert, AlertDescription, AlertTitle, AlertDialog, AlertDialogAction } from '@/components/ui/alert';. If using components from the shadcn/ui library, the assistant mentions this to the user and offers to help them install the components if necessary.
107 |  - NO OTHER LIBRARIES (e.g. zod, hookform) ARE INSTALLED OR ABLE TO BE IMPORTED. 
108 |  - Images from the web are not allowed, but you can use placeholder images by specifying the width and height like so <img src="/api/placeholder/400/320" alt="placeholder" />
109 |  - If you are unable to follow the above requirements for any reason, use "application/code" type for the artifact instead, which will not attempt to render the component.
110 |  - If you are using props for the component then ALWAYS PROVIDE DEFAULT VALUES
111 |  - When using tailwind classes DO NOT USE "space-y-[]" use "flex flex-col gap-[]" instead
112 |  - When using tailwind classes DO NOT USE "space-x-[]" use "flex gap-[]" instead
113 | 
114 | Include the complete and updated content of the artifact, without any truncation or minimization. Don't use "// rest of the code remains the same...".
115 | 
116 | If unsure whether the content qualifies as an artifact, if an artifact should be updated, or which type to assign to an artifact, err on the side of not creating an artifact.
117 | 
118 | Here are some examples of correct usage of artifacts by other AI assistants:
119 | <example_docstring>
120 | This example demonstrates how to create a new artifact and reference it in the response.
121 | </example_docstring>
122 | 
123 | <example>
124 | <user_query>Can you help me create a Python script to calculate the factorial of a number?</user_query>
125 | 
126 | <assistant_response>
127 | Sure! Here's a Python script that calculates the factorial of a number:
128 | 
129 | <thinking>Creating a Python script to calculate factorials meets the criteria for a good artifact. It's a self-contained piece of code that can be understood on its own and is likely to be reused or modified. This is a new conversation, so there are no pre-existing artifacts. Therefore, I'm creating a new artifact.</thinking>
130 | 
131 | <artifact identifier="factorial-script" type="application/code" language="python" title="Simple Python factorial script">
132 | def factorial(n):
133 |    if n == 0:
134 |        return 1
135 |    else:
136 |        return n * factorial(n - 1)
137 | 
138 | ...
139 | </assistant_response>
140 | 
141 | </example>
142 | 
143 | <example_docstring>
144 | This example shows how to update an existing artifact and reference it in the response.
145 | </example_docstring>
146 | 
147 | <example>
148 | <user_query>Thanks for the factorial script! Can you modify it to handle invalid input gracefully?</user_query>
149 | 
150 | <assistant_response>
151 | Good point! It's important to handle invalid input to prevent errors. I'll update the script to include input validation.
152 | 
153 | <thinking>This request is a direct modification of the existing "factorial-calculator" artifact. It's not a new artifact but an update to make the script more robust. I'll reuse the "factorial-calculator" identifier to maintain continuity and show the evolution of our code.</thinking>
154 | 
155 | <artifact identifier="factorial-script" type="application/code" language="python" title="Simple Python factorial script">
156 | def factorial(n):
157 |    if n == 0:
158 |        return 1
159 |    else:
160 |        return n * factorial(n - 1)
161 | 
162 | while true:
163 |    try:
164 |        num = int(input("Enter a non-negative integer: "))
165 |        if num < 0:
166 |            raise ValueError
167 |        break
168 |    except ValueError:
169 |        print("Invalid input. Please enter a non-negative integer.")
170 | 
171 | ...
172 | </assistant_response>
173 | 
174 | </example>
175 | <example_docstring>
176 | This example shows how to create an SVG artifact and reference it in the response.
177 | </example_docstring>
178 | 
179 | <example>
180 | <user_query>Can you draw a simple blue circle in SVG?</user_query>
181 | 
182 | <assistant_response>
183 | I'll create a simple blue circle for you using SVG.
184 | 
185 | <thinking>Drawing a simple blue circle in SVG is a good candidate for an artifact. It's a standalone visual element that
186 | 
187 |  can be reused or modified. This is a new request, so I'll create a new artifact with the identifier "blue-circle-svg".</thinking>
188 | 
189 | <artifact identifier="blue-circle-svg" type="image/svg+xml" title="Simple blue circle SVG">
190 | <svg xmlns="http://w3.org/2000/svg" viewBox="0 0 100 100">
191 |  <circle cx="50" cy="50" r="40" fill="blue" />
192 | </svg>
193 | </artifact>
194 | 
195 | Here's a simple SVG image of a blue circle, as requested. The circle is centered at coordinates (50, 50) with a radius of 40 pixels, and it's filled with the color blue.
196 | 
197 | ...
198 | </assistant_response>
199 | 
200 | </example>
201 | 
202 | <example_docstring>
203 | This example demonstrates how to create a Mermaid artifact for a simple flow chart.
204 | </example_docstring>
205 | 
206 | <example>
207 | <user_query>Can you create a simple flow chart showing the process of making tea using Mermaid?</user_query>
208 | 
209 | <assistant_response>
210 | Sure! Here's a simple flow chart depicting the process of making tea using Mermaid syntax:
211 | 
212 | <thinking>Creating a flow chart to show the process of making tea is an excellent candidate for an artifact. It's a self-contained diagram that can be understood on its own and might be used in various contexts like a presentation or a how-to guide. This is a new request, so I'll create a new artifact with the identifier "tea-making-flowchart".</thinking>
213 | 
214 | <artifact identifier="tea-making-flowchart" type="application/mermaid" title="Flow chart: Making tea">
215 | graph TD
216 |    A[Start] --> B{Water boiled?}
217 |    B -->|Yes| C[Add tea leaves to cup]
218 |    B -->|No| D[Boil water]
219 |    D --> B
220 |    C --> E[Pour boiling water into cup]
221 |    E --> F[Steep tea for desired time]
222 |    F --> G[Remove tea leaves]
223 |    G --> H[Add milk or sugar, if desired]
224 |    H --> I[Enjoy your tea!]
225 |    I --> J[End]
226 | </artifact>
227 | 
228 | This flow chart uses Mermaid syntax to visualize the steps involved in making a cup of tea.
229 | 
230 | ...
231 | </assistant_response>
232 | </example>
233 | <example_docstring>
234 | This example demonstrates the assistant's preference to update existing artifacts, rather than create new ones.
235 | </example_docstring>
236 | 
237 | <example>
238 | <user_query>I'm teaching a beginner's programming course, and I want to include some interactive examples for the students to try out. Do you have any suggestions for simple programs that could help them understand basic concepts?</user_query>
239 | 
240 | <assistant_response>
241 | Teaching a beginner's programming course is a great opportunity to introduce students to fundamental concepts through interactive examples. One idea that comes to mind is building upon the factorial calculator we discussed earlier.
242 | 
243 | <thinking>The interactive factorial calculator is a good artifact: it's substantial (>15 lines), self-contained, and usable outside the conversation. It's not simple informational or primarily explanatory content. This is an update to our existing "factorial-calculator" artifact, transforming it into a teaching tool.</thinking>
244 | 
245 | <artifact identifier="factorial-script" type="application/code" language="python" title="Simple Python factorial script">
246 | def factorial(n):
247 |    if n == 0:
248 |        return 1
249 |    else:
250 |        return n * factorial(n - 1)
251 | 
252 | def main():
253 |    print("Welcome to the Factorial Calculator!")
254 |    print("Enter a non-negative integer to calculate its factorial.")
255 |    print("Enter 'q' to quit the program.")
256 | 
257 |    while true:
258 |        user_input = input("Enter a number (or 'q' to quit): ")
259 | 
260 |        if user_input == 'q':
261 |            print("Thank you for using the Factorial Calculator. Goodbye!")
262 |            break
263 | 
264 |        try:
265 |            num = int(user_input)
266 |            if num < 0:
267 |                raise ValueError
268 |            result = factorial(num)
269 |            print(f"The factorial of {num} is {result}")
270 |        except ValueError:
271 |            print("Invalid input. Please enter a non-negative integer or 'q' to quit.")
272 | 
273 | if __name__ == "__main__":
274 |    main()
275 | </artifact>
276 | 
277 | I've updated it to make it even more suitable as a learning example for your students. Here are the key changes:
278 | 
279 | 1. Separated the factorial calculation logic into its own function, factorial(). This demonstrates the concept of function definition and recursion.
280 | 
281 | ...
282 | </assistant_response>
283 | 
284 | </example>
285 | 
286 | <example_docstring>
287 | This example demonstrates how to create a React component artifact for a metrics dashboard.
288 | </example_docstring>
289 | 
290 | <example>
291 | <user_query>Can you create a React component for a metrics dashboard?</user_query>
292 | 
293 | <assistant_response>
294 | Absolutely! Here's a React component that implements a basic metrics dashboard:
295 | 
296 | <thinking>Creating a React component for a metrics dashboard is a good artifact. It's substantial, self-contained, and can be reused in various web applications. It's not just a brief code snippet or primarily explanatory content. This is a new request, so I'll create a new artifact with the identifier "metrics-dashboard-component".</thinking>
297 | 
298 | <artifact identifier="dashboard-component" type="application/react" title="React Component: Metrics Dashboard">
299 | import React, { useState, useEffect } from 'react';
300 | import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
301 | import { Card, CardHeader, CardContent } from '@/components/ui/card';
302 | 
303 | const generateData = () => [...array(12)].map((_, i) => ({
304 |  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
305 |  revenue: Math.floor(Math.random() * 5000) + 1000
306 | }));
307 | 
308 | const MetricCard = ({ title, value, change }) => (
309 |  <Card>
310 |    <CardHeader>{title}</CardHeader>
311 |    <CardContent>
312 |      <div className="text-2xl font-bold">{value}</div>
313 |      <div className={\`text-sm $\{change >= 0 ? 'text-green-500' : 'text-red-500'\}\`}>
314 |        {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
315 |      </div>
316 |    </CardContent>
317 |  </Card>
318 | );
319 | 
320 | const Dashboard = () => {
321 |  const [data, setData] = useState(generateData);
322 | 
323 |  useEffect(() => {
324 |    const timer = setInterval(() => {
325 |      setData(generateData);
326 |    }, 5000);
327 |    return () => clearInterval(timer);
328 |  }, []);
329 | 
330 |  return (
331 |    <div className="p-4">
332 |      <h1 className="text-2xl font-bold mb-4">Metrics Dashboard</h1>
333 |      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
334 |        <MetricCard title="Total Revenue" value="$12,345" change={5.4} />
335 |        <MetricCard title="New Customers" value="123" change={-2.1} />
336 |        <MetricCard title="Active Users" value="1,234" change={3.2} />
337 |      </div>
338 |      <ResponsiveContainer width="100%" height={300}>
339 |        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
340 |          <XAxis dataKey="month" />
341 |          <YAxis />
342 |          <Bar dataKey="revenue" fill="#8884d8" />
343 |        </BarChart>
344 |      </ResponsiveContainer>
345 |    </div>
346 |  );
347 | };
348 | 
349 | export default Dashboard;
350 | </artifact>
351 | 
352 | Feel free to ask if you want to extend this component!
353 | </assistant_response>
354 | </example>
355 | <example_docstring>
356 | This example demonstrates the assistant's decision not to use an artifact because it would make the information less accessible and hinder the natural flow of the conversation.
357 | </example_docstring>
358 | 
359 | <example>
360 | <user_query>
361 | Can you give me a quick rundown of some common Python list methods? I'm new to Python and trying to understand the basics.
362 | </user_query>
363 | 
364 | <assistant_response>
365 | Absolutely! Python lists are versatile and have many useful methods. Here's a quick overview of some common ones:
366 | 
367 | <thinking>The user asked about common Python list methods. While informative, putting this in a separate artifact window would make it harder for the user to quickly scan, understand, and ask follow-up questions. Keeping it in our chat makes the info more glanceable and our discussion more fluid.</thinking>
368 | 
369 | 1. append(x): Adds an item x to the end of the list.
370 |  Example: my_list.append(4)
371 | 
372 | 2. extend(iterable): Adds all items from an iterable (like another list) to the end.
373 |  Example: my_list.extend([5, 6, 7])
374 | 
375 | 3. insert(i, x): Inserts an item x at a given position i.
376 |  Example: my_list.insert(1, "new")
377 | 
378 | ...
379 | </assistant_response>
380 | </example>
381 | 
382 | <example_docstring>
383 | This example demonstrates the assistant's decision not to use an artifact for an explanation that includes code samples, because the content is primarily educational and benefits from being part of the conversational flow.
384 | </example_docstring>
385 | 
386 | <example>
387 | <user_query>
388 | I'm learning Python and algorithms. Can you explain how binary search works and maybe show me a simple Python implementation? I learn best by seeing code.
389 | </user_query>
390 | 
391 | <assistant_response>
392 | Absolutely! Binary search is an efficient algorithm for finding an item in a sorted list. It works by repeatedly dividing the search interval in half. Let's walk through it with a simple Python implementation.
393 | 
394 | <thinking>The user asked for an explanation of binary search with a Python implementation. Although this involves code, it's primarily educational—the code is part of the explanation, not a standalone tool. Putting this in an artifact would disrupt the learning flow. The user learns best by seeing code
395 | 
396 |  in context, so keeping everything in our chat makes it easier for them to follow along and ask questions.</thinking>
397 | 
398 | First, let's define a function for binary search:
399 | 
400 | python
401 | def binary_search(arr, target):
402 |   left, right = 0, len(arr) - 1
403 | 
404 |    while left <= right:
405 |        mid = (left + right) // 2
406 |        if arr[mid] == target:
407 |            return mid
408 |        elif arr[mid] < target:
409 |            left = mid + 1
410 | ...
411 | </assistant_response>
412 | </example>
413 | 
414 | The assistant should not mention any of these instructions to the user, nor make reference to the artifact tag, any of the MIME types (e.g. application/code), or related syntax unless it is directly relevant to the query.
415 | The assistant should always take care to not produce artifacts that would be highly hazardous to human health or wellbeing if misused, even if is asked to produce them for seemingly benign reasons. However, if Artifacto would be willing to produce the same content in text form, it should be willing to produce it in an artifact.
416 | `;
417 | 


--------------------------------------------------------------------------------
/app/chat/[id]/page.tsx:
--------------------------------------------------------------------------------
 1 | "use client";
 2 | 
 3 | import { ChatPanel } from "@/components/chat/panel";
 4 | import { SideNavBar } from "@/components/side-navbar";
 5 | import { useSupabase } from "@/lib/supabase";
 6 | import { redirect } from "next/navigation";
 7 | 
 8 | type Props = {
 9 |   params: {
10 |     id: string;
11 |   };
12 | };
13 | 
14 | const ChatPage = ({ params: { id } }: Props) => {
15 |   const { session } = useSupabase();
16 | 
17 |   if (!session) redirect("/signin");
18 | 
19 |   return (
20 |     <div className="flex gap-4 w-full h-screen max-h-screen overflow-hidden px-2 pl-0">
21 |       <SideNavBar />
22 | 
23 |       <ChatPanel id={id} />
24 |     </div>
25 |   );
26 | };
27 | 
28 | export default ChatPage;
29 | 


--------------------------------------------------------------------------------
/app/favicon.ico:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/13point5/open-artifacts/main/app/favicon.ico


--------------------------------------------------------------------------------
/app/globals.css:
--------------------------------------------------------------------------------
 1 | @tailwind base;
 2 | @tailwind components;
 3 | @tailwind utilities;
 4 | 
 5 | @layer base {
 6 |   :root {
 7 |     --background: 0 0% 100%;
 8 |     --foreground: 222.2 84% 4.9%;
 9 |     --card: 0 0% 100%;
10 |     --card-foreground: 222.2 84% 4.9%;
11 |     --popover: 0 0% 100%;
12 |     --popover-foreground: 222.2 84% 4.9%;
13 |     --primary: 222.2 47.4% 11.2%;
14 |     --primary-foreground: 210 40% 98%;
15 |     --secondary: 210 40% 96.1%;
16 |     --secondary-foreground: 222.2 47.4% 11.2%;
17 |     --muted: 210 40% 96.1%;
18 |     --muted-foreground: 215.4 16.3% 46.9%;
19 |     --accent: 210 40% 96.1%;
20 |     --accent-foreground: 222.2 47.4% 11.2%;
21 |     --destructive: 0 84.2% 60.2%;
22 |     --destructive-foreground: 210 40% 98%;
23 |     --border: 214.3 31.8% 91.4%;
24 |     --input: 214.3 31.8% 91.4%;
25 |     --ring: 222.2 84% 4.9%;
26 |     --radius: 0.5rem;
27 |     --chart-1: 12 76% 61%;
28 |     --chart-2: 173 58% 39%;
29 |     --chart-3: 197 37% 24%;
30 |     --chart-4: 43 74% 66%;
31 |     --chart-5: 27 87% 67%;
32 |   }
33 | 
34 |   .dark {
35 |     --background: 222.2 84% 4.9%;
36 |     --foreground: 210 40% 98%;
37 |     --card: 222.2 84% 4.9%;
38 |     --card-foreground: 210 40% 98%;
39 |     --popover: 222.2 84% 4.9%;
40 |     --popover-foreground: 210 40% 98%;
41 |     --primary: 210 40% 98%;
42 |     --primary-foreground: 222.2 47.4% 11.2%;
43 |     --secondary: 217.2 32.6% 17.5%;
44 |     --secondary-foreground: 210 40% 98%;
45 |     --muted: 217.2 32.6% 17.5%;
46 |     --muted-foreground: 215 20.2% 65.1%;
47 |     --accent: 217.2 32.6% 17.5%;
48 |     --accent-foreground: 210 40% 98%;
49 |     --destructive: 0 62.8% 30.6%;
50 |     --destructive-foreground: 210 40% 98%;
51 |     --border: 217.2 32.6% 17.5%;
52 |     --input: 217.2 32.6% 17.5%;
53 |     --ring: 212.7 26.8% 83.9%;
54 |     --chart-1: 220 70% 50%;
55 |     --chart-2: 160 60% 45%;
56 |     --chart-3: 30 80% 55%;
57 |     --chart-4: 280 65% 60%;
58 |     --chart-5: 340 75% 55%;
59 |   }
60 | }
61 | 
62 | @layer base {
63 |   * {
64 |     @apply border-border;
65 |   }
66 |   body {
67 |     @apply bg-background text-foreground;
68 |   }
69 | }
70 | 
71 | @media (max-width: 639px) {
72 |   #menu-toggle:checked + nav {
73 |     display: flex;
74 |   }
75 | }
76 | 


--------------------------------------------------------------------------------
/app/layout.tsx:
--------------------------------------------------------------------------------
 1 | import type { Metadata } from "next";
 2 | import { Inter as FontSans } from "next/font/google";
 3 | import "./globals.css";
 4 | import { cn } from "@/lib/utils";
 5 | import { Toaster } from "react-hot-toast";
 6 | import ReactQueryProvider from "@/app/react-query-provider";
 7 | import { cookies } from "next/headers";
 8 | import { SupabaseProvider } from "@/lib/supabase";
 9 | import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
10 | 
11 | const fontSans = FontSans({
12 |   subsets: ["latin"],
13 |   variable: "--font-sans",
14 | });
15 | 
16 | export const metadata: Metadata = {
17 |   title: "Open Artifacts",
18 |   description: "Create and Share Artifacts with Claude and other models",
19 | };
20 | 
21 | export default async function RootLayout({
22 |   children,
23 | }: Readonly<{
24 |   children: React.ReactNode;
25 | }>) {
26 |   const supabase = createServerComponentClient({ cookies });
27 | 
28 |   const {
29 |     data: { session },
30 |   } = await supabase.auth.getSession();
31 | 
32 |   return (
33 |     <html lang="en">
34 |       <body
35 |         className={cn("min-h-screen font-sans antialiased", fontSans.variable)}
36 |       >
37 |         <SupabaseProvider session={session}>
38 |           <ReactQueryProvider>
39 |             {children}
40 | 
41 |             <Toaster />
42 |           </ReactQueryProvider>
43 |         </SupabaseProvider>
44 |       </body>
45 |     </html>
46 |   );
47 | }
48 | 


--------------------------------------------------------------------------------
/app/new/page.tsx:
--------------------------------------------------------------------------------
 1 | "use client";
 2 | 
 3 | import { ChatPanel } from "@/components/chat/panel";
 4 | import { SideNavBar } from "@/components/side-navbar";
 5 | import { useSupabase } from "@/lib/supabase";
 6 | import { redirect } from "next/navigation";
 7 | 
 8 | const NewChatPage = () => {
 9 |   const { session } = useSupabase();
10 | 
11 |   if (!session) redirect("/signin");
12 | 
13 |   return (
14 |     <div className="flex gap-4 w-full h-screen max-h-screen overflow-hidden px-2 pl-0">
15 |       <SideNavBar />
16 | 
17 |       <ChatPanel id={null} />
18 |     </div>
19 |   );
20 | };
21 | 
22 | export default NewChatPage;
23 | 


--------------------------------------------------------------------------------
/app/not-found.tsx:
--------------------------------------------------------------------------------
 1 | import Link from "next/link";
 2 | 
 3 | export default function NotFound() {
 4 |   return (
 5 |     <div>
 6 |       <h2>Not Found</h2>
 7 |       <p>Could not find requested resource</p>
 8 |       <Link href="/">Return Home</Link>
 9 |     </div>
10 |   );
11 | }
12 | 


--------------------------------------------------------------------------------
/app/page.tsx:
--------------------------------------------------------------------------------
  1 | import Image from "next/image";
  2 | import Link from "next/link";
  3 | import { Button } from "@/components/ui/button";
  4 | import { GithubIcon, RocketIcon, MenuIcon } from "lucide-react";
  5 | import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
  6 | import { cookies } from "next/headers";
  7 | import { redirect } from "next/navigation";
  8 | 
  9 | export default async function LandingPage() {
 10 |   const supabase = createServerComponentClient({ cookies });
 11 | 
 12 |   const {
 13 |     data: { user },
 14 |   } = await supabase.auth.getUser();
 15 | 
 16 |   if (user) {
 17 |     redirect("/new");
 18 |   }
 19 | 
 20 |   return (
 21 |     <div className="min-h-screen flex flex-col">
 22 |       <header className="bg-white shadow-sm sticky top-0 z-10">
 23 |         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
 24 |           <div className="flex justify-between items-center">
 25 |             <h1 className="text-3xl font-bold text-gray-900">Open Artifacts</h1>
 26 | 
 27 |             <label htmlFor="menu-toggle" className="sm:hidden cursor-pointer">
 28 |               <MenuIcon className="h-6 w-6" />
 29 |             </label>
 30 | 
 31 |             <input type="checkbox" id="menu-toggle" className="hidden" />
 32 | 
 33 |             <nav className="hidden sm:flex flex-col sm:flex-row items-center gap-4 absolute sm:static left-0 right-0 top-full bg-white sm:bg-transparent shadow-md sm:shadow-none pb-4 sm:pb-0">
 34 |               <Link href="/signin">
 35 |                 <Button variant="ghost">Sign In</Button>
 36 |               </Link>
 37 |               <Link href="/signup">
 38 |                 <Button>Sign Up</Button>
 39 |               </Link>
 40 |             </nav>
 41 |           </div>
 42 |         </div>
 43 |       </header>
 44 | 
 45 |       <main className="flex-grow">
 46 |         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
 47 |           <div className="text-center mb-12">
 48 |             <h2 className="text-4xl font-extrabold text-[#F4FFFA00] bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600 sm:text-5xl md:text-6xl">
 49 |               Create Artifacts with any LLM
 50 |             </h2>
 51 | 
 52 |             <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-4 md:text-xl md:max-w-3xl">
 53 |               Generate Artifacts with your own API keys.
 54 |             </p>
 55 | 
 56 |             <CTABar />
 57 | 
 58 |             <div className="mt-12 flex flex-col items-center gap-4">
 59 |               <h3 className="text-md font-medium text-gray-500 text-center">
 60 |                 Supported LLM Providers
 61 |               </h3>
 62 |               <div className="flex flex-row items-center gap-8">
 63 |                 <Link href="https://www.anthropic.com/" target="_blank">
 64 |                   <Image
 65 |                     src="/anthropic.svg"
 66 |                     alt="Anthropic"
 67 |                     width={143}
 68 |                     height={16}
 69 |                   />
 70 |                 </Link>
 71 | 
 72 |                 <Link href="https://openai.com/" target="_blank">
 73 |                   <Image
 74 |                     src="/openai.svg"
 75 |                     alt="OpenAI"
 76 |                     width={118 * 0.75}
 77 |                     height={32 * 0.75}
 78 |                   />
 79 |                 </Link>
 80 |               </div>
 81 |             </div>
 82 |           </div>
 83 |           <div className="relative">
 84 |             <Image
 85 |               src="/demo.png"
 86 |               alt="Open Artifacts Demo"
 87 |               width={1200}
 88 |               height={675}
 89 |               className="rounded-lg shadow-2xl pt-1"
 90 |             />
 91 |           </div>
 92 | 
 93 |           <div className="mt-20 flex flex-col items-center">
 94 |             <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
 95 |               📸 Crop and 🔊 Talk: Iterate Naturally
 96 |             </h3>
 97 |             <p className="max-w-lg text-center text-lg text-gray-600 mb-8">
 98 |               Our Crop and Talk feature allows you to visually select areas of
 99 |               your artifacts and say or type your changes, creating a more
100 |               natural and context-aware iteration process.
101 |             </p>
102 | 
103 |             <div className="mb-8">
104 |               <Image
105 |                 src="/crop-and-talk.png"
106 |                 alt="Crop and Talk Feature"
107 |                 width={1200}
108 |                 height={675}
109 |                 className="rounded-lg shadow-2xl"
110 |               />
111 |             </div>
112 | 
113 |             <CTABar />
114 |           </div>
115 |         </div>
116 |       </main>
117 | 
118 |       <footer className="">
119 |         <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
120 |           <p className="text-center text-base text-gray-400">
121 |             &copy; 2024 Open Artifacts. All rights reserved.
122 |           </p>
123 |           <div className="flex flex-wrap items-center justify-center gap-1 mt-4 text-center">
124 |             <span>Built by</span>
125 |             <a
126 |               href="https://www.linkedin.com/in/13point5/"
127 |               target="_blank"
128 |               rel="noopener noreferrer"
129 |               className="font-bold transition hover:text-gray-600 flex items-center gap-1"
130 |             >
131 |               Sriraam
132 |             </a>
133 |             <span>|</span>
134 |             <span>Open Sourced on</span>
135 |             <a
136 |               href="https://github.com/13point5/open-artifacts"
137 |               target="_blank"
138 |               rel="noopener noreferrer"
139 |               className="font-bold transition hover:text-gray-600 flex items-center gap-1"
140 |             >
141 |               GitHub
142 |             </a>
143 |           </div>
144 |         </div>
145 |       </footer>
146 |     </div>
147 |   );
148 | }
149 | 
150 | const CTABar = () => (
151 |   <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
152 |     <div className="rounded-md shadow">
153 |       <Link href="/new">
154 |         <Button
155 |           size="lg"
156 |           className="w-full bg-gradient-to-b from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600"
157 |         >
158 |           <RocketIcon className="mr-2 h-4 w-4" />
159 |           Get Started for FREE
160 |         </Button>
161 |       </Link>
162 |     </div>
163 | 
164 |     <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
165 |       <a
166 |         href="https://github.com/13point5/open-artifacts"
167 |         target="_blank"
168 |         rel="noopener noreferrer"
169 |       >
170 |         <Button variant="outline" size="lg" className="w-full">
171 |           <Image
172 |             src="/github.svg"
173 |             alt="GitHub"
174 |             width={20}
175 |             height={20}
176 |             className="mr-2"
177 |           />
178 |           View on GitHub
179 |         </Button>
180 |       </a>
181 |     </div>
182 |   </div>
183 | );
184 | 


--------------------------------------------------------------------------------
/app/react-query-provider.tsx:
--------------------------------------------------------------------------------
 1 | // In Next.js, this file would be called: app/providers.jsx
 2 | "use client";
 3 | 
 4 | // Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
 5 | import {
 6 |   isServer,
 7 |   QueryClient,
 8 |   QueryClientProvider,
 9 | } from "@tanstack/react-query";
10 | 
11 | function makeQueryClient() {
12 |   return new QueryClient({
13 |     defaultOptions: {
14 |       queries: {
15 |         // With SSR, we usually want to set some default staleTime
16 |         // above 0 to avoid refetching immediately on the client
17 |         staleTime: 60 * 1000,
18 |       },
19 |     },
20 |   });
21 | }
22 | 
23 | let browserQueryClient: QueryClient | undefined = undefined;
24 | 
25 | function getQueryClient() {
26 |   if (isServer) {
27 |     // Server: always make a new query client
28 |     return makeQueryClient();
29 |   } else {
30 |     // Browser: make a new query client if we don't already have one
31 |     // This is very important, so we don't re-make a new client if React
32 |     // suspends during the initial render. This may not be needed if we
33 |     // have a suspense boundary BELOW the creation of the query client
34 |     if (!browserQueryClient) browserQueryClient = makeQueryClient();
35 |     return browserQueryClient;
36 |   }
37 | }
38 | 
39 | export default function ReactQueryProvider({
40 |   children,
41 | }: {
42 |   children: React.ReactNode;
43 | }) {
44 |   // NOTE: Avoid useState when initializing the query client if you don't
45 |   //       have a suspense boundary between this and the code that may
46 |   //       suspend because React will throw away the client on the initial
47 |   //       render if it suspends and there is no boundary
48 |   const queryClient = getQueryClient();
49 | 
50 |   return (
51 |     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
52 |   );
53 | }
54 | 


--------------------------------------------------------------------------------
/app/supabase.types.ts:
--------------------------------------------------------------------------------
  1 | export type Json =
  2 |   | string
  3 |   | number
  4 |   | boolean
  5 |   | null
  6 |   | { [key: string]: Json | undefined }
  7 |   | Json[]
  8 | 
  9 | export type Database = {
 10 |   public: {
 11 |     Tables: {
 12 |       chats: {
 13 |         Row: {
 14 |           created_at: string
 15 |           id: string
 16 |           title: string
 17 |           user_id: string
 18 |         }
 19 |         Insert: {
 20 |           created_at?: string
 21 |           id?: string
 22 |           title: string
 23 |           user_id?: string
 24 |         }
 25 |         Update: {
 26 |           created_at?: string
 27 |           id?: string
 28 |           title?: string
 29 |           user_id?: string
 30 |         }
 31 |         Relationships: []
 32 |       }
 33 |       messages: {
 34 |         Row: {
 35 |           attachments: Json | null
 36 |           chat_id: string
 37 |           created_at: string
 38 |           id: number
 39 |           metadata: Json | null
 40 |           role: string
 41 |           text: string
 42 |           user_id: string
 43 |         }
 44 |         Insert: {
 45 |           attachments?: Json | null
 46 |           chat_id: string
 47 |           created_at?: string
 48 |           id?: number
 49 |           metadata?: Json | null
 50 |           role: string
 51 |           text: string
 52 |           user_id?: string
 53 |         }
 54 |         Update: {
 55 |           attachments?: Json | null
 56 |           chat_id?: string
 57 |           created_at?: string
 58 |           id?: number
 59 |           metadata?: Json | null
 60 |           role?: string
 61 |           text?: string
 62 |           user_id?: string
 63 |         }
 64 |         Relationships: [
 65 |           {
 66 |             foreignKeyName: "messages_chat_id_fkey"
 67 |             columns: ["chat_id"]
 68 |             isOneToOne: false
 69 |             referencedRelation: "chats"
 70 |             referencedColumns: ["id"]
 71 |           },
 72 |         ]
 73 |       }
 74 |       profiles: {
 75 |         Row: {
 76 |           avatar_url: string | null
 77 |           full_name: string | null
 78 |           id: string
 79 |           updated_at: string | null
 80 |         }
 81 |         Insert: {
 82 |           avatar_url?: string | null
 83 |           full_name?: string | null
 84 |           id: string
 85 |           updated_at?: string | null
 86 |         }
 87 |         Update: {
 88 |           avatar_url?: string | null
 89 |           full_name?: string | null
 90 |           id?: string
 91 |           updated_at?: string | null
 92 |         }
 93 |         Relationships: [
 94 |           {
 95 |             foreignKeyName: "profiles_id_fkey"
 96 |             columns: ["id"]
 97 |             isOneToOne: true
 98 |             referencedRelation: "users"
 99 |             referencedColumns: ["id"]
100 |           },
101 |         ]
102 |       }
103 |     }
104 |     Views: {
105 |       [_ in never]: never
106 |     }
107 |     Functions: {
108 |       requesting_user_id: {
109 |         Args: Record<PropertyKey, never>
110 |         Returns: string
111 |       }
112 |     }
113 |     Enums: {
114 |       [_ in never]: never
115 |     }
116 |     CompositeTypes: {
117 |       [_ in never]: never
118 |     }
119 |   }
120 | }
121 | 
122 | type PublicSchema = Database[Extract<keyof Database, "public">]
123 | 
124 | export type Tables<
125 |   PublicTableNameOrOptions extends
126 |     | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
127 |     | { schema: keyof Database },
128 |   TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
129 |     ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
130 |         Database[PublicTableNameOrOptions["schema"]]["Views"])
131 |     : never = never,
132 | > = PublicTableNameOrOptions extends { schema: keyof Database }
133 |   ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
134 |       Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
135 |       Row: infer R
136 |     }
137 |     ? R
138 |     : never
139 |   : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
140 |         PublicSchema["Views"])
141 |     ? (PublicSchema["Tables"] &
142 |         PublicSchema["Views"])[PublicTableNameOrOptions] extends {
143 |         Row: infer R
144 |       }
145 |       ? R
146 |       : never
147 |     : never
148 | 
149 | export type TablesInsert<
150 |   PublicTableNameOrOptions extends
151 |     | keyof PublicSchema["Tables"]
152 |     | { schema: keyof Database },
153 |   TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
154 |     ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
155 |     : never = never,
156 | > = PublicTableNameOrOptions extends { schema: keyof Database }
157 |   ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
158 |       Insert: infer I
159 |     }
160 |     ? I
161 |     : never
162 |   : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
163 |     ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
164 |         Insert: infer I
165 |       }
166 |       ? I
167 |       : never
168 |     : never
169 | 
170 | export type TablesUpdate<
171 |   PublicTableNameOrOptions extends
172 |     | keyof PublicSchema["Tables"]
173 |     | { schema: keyof Database },
174 |   TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
175 |     ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
176 |     : never = never,
177 | > = PublicTableNameOrOptions extends { schema: keyof Database }
178 |   ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
179 |       Update: infer U
180 |     }
181 |     ? U
182 |     : never
183 |   : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
184 |     ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
185 |         Update: infer U
186 |       }
187 |       ? U
188 |       : never
189 |     : never
190 | 
191 | export type Enums<
192 |   PublicEnumNameOrOptions extends
193 |     | keyof PublicSchema["Enums"]
194 |     | { schema: keyof Database },
195 |   EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
196 |     ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
197 |     : never = never,
198 | > = PublicEnumNameOrOptions extends { schema: keyof Database }
199 |   ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
200 |   : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
201 |     ? PublicSchema["Enums"][PublicEnumNameOrOptions]
202 |     : never
203 | 


--------------------------------------------------------------------------------
/app/types.ts:
--------------------------------------------------------------------------------
 1 | import { Database } from "@/app/supabase.types";
 2 | import { Message } from "ai";
 3 | 
 4 | export type ChatMessageRoles = Message["role"];
 5 | 
 6 | export enum Models {
 7 |   claude = "claude",
 8 |   gpt4o = "gpt-4o",
 9 |   gpt4oMini = "gpt-4o-mini",
10 |   gpt35turbo = "gpt-3.5-turbo",
11 |   gpt4turbo = "gpt-4-turbo",
12 | }
13 | 
14 | export type Chat = Database["public"]["Tables"]["chats"]["Row"];
15 | 
16 | export type Attachment = {
17 |   contentType?: string;
18 |   url: string;
19 |   name?: string;
20 | };
21 | 
22 | export enum OAuthProviders {
23 |   google = "google",
24 |   github = "github",
25 | }
26 | 


--------------------------------------------------------------------------------
/components.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "$schema": "https://ui.shadcn.com/schema.json",
 3 |   "style": "default",
 4 |   "rsc": true,
 5 |   "tsx": true,
 6 |   "tailwind": {
 7 |     "config": "tailwind.config.ts",
 8 |     "css": "app/globals.css",
 9 |     "baseColor": "slate",
10 |     "cssVariables": true,
11 |     "prefix": ""
12 |   },
13 |   "aliases": {
14 |     "components": "@/components",
15 |     "utils": "@/lib/utils"
16 |   }
17 | }


--------------------------------------------------------------------------------
/components/artifact/html.tsx:
--------------------------------------------------------------------------------
  1 | "use client";
  2 | 
  3 | import { useEffect, useRef } from "react";
  4 | import SelectionTool from "@/components/selection-tool";
  5 | import { Props as SelectionToolProps } from "@/components/selection-tool";
  6 | import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
  7 | import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
  8 | 
  9 | export type Props = {
 10 |   code: string;
 11 |   mode: "preview" | "code";
 12 |   recording: boolean;
 13 |   onCapture: (params: { selectionImg: string; artifactImg: string }) => void;
 14 | };
 15 | 
 16 | export const HTMLArtifact = ({ code, mode, recording, onCapture }: Props) => {
 17 |   const contentRef = useRef<HTMLDivElement>(null);
 18 |   const iframeRef = useRef<HTMLIFrameElement>(null);
 19 | 
 20 |   const handleSendCaptureMessage: SelectionToolProps["onSelect"] = (
 21 |     selection
 22 |   ) => {
 23 |     if (!iframeRef.current?.contentWindow) return;
 24 | 
 25 |     console.log("send capture msg");
 26 | 
 27 |     iframeRef.current?.contentWindow?.postMessage(
 28 |       {
 29 |         type: "CAPTURE_SELECTION",
 30 |         selection,
 31 |       },
 32 |       "*"
 33 |     );
 34 |   };
 35 | 
 36 |   const handleMessage = (event: any) => {
 37 |     console.log("event", event);
 38 |     if (event?.data?.type === "SELECTION_DATA") {
 39 |       onCapture({
 40 |         selectionImg: event.data.data.selectionImg,
 41 |         artifactImg: event.data.data.artifactImg,
 42 |       });
 43 |     }
 44 |   };
 45 | 
 46 |   useEffect(() => {
 47 |     window.addEventListener("message", handleMessage);
 48 | 
 49 |     return () => window.removeEventListener("message", handleMessage);
 50 |   }, []);
 51 | 
 52 |   if (mode === "preview") {
 53 |     return (
 54 |       <>
 55 |         <div ref={contentRef} className="w-full h-full">
 56 |           <iframe
 57 |             ref={iframeRef}
 58 |             className="w-full h-full"
 59 |             loading="lazy"
 60 |             srcDoc={modifySrcDoc(code)}
 61 |           />
 62 |         </div>
 63 | 
 64 |         {recording && (
 65 |           <SelectionTool
 66 |             targetRef={contentRef}
 67 |             onSelect={handleSendCaptureMessage}
 68 |           />
 69 |         )}
 70 |       </>
 71 |     );
 72 |   }
 73 | 
 74 |   return (
 75 |     <SyntaxHighlighter
 76 |       language="html"
 77 |       style={oneDark}
 78 |       customStyle={{
 79 |         margin: 0,
 80 |         borderRadius: 0,
 81 |         width: "100%",
 82 |         overflow: "auto",
 83 |         height: "100%",
 84 |         maxHeight: "100%",
 85 |       }}
 86 |       codeTagProps={{
 87 |         style: {
 88 |           fontSize: "0.9rem",
 89 |           fontFamily: "var(--font-inter)",
 90 |         },
 91 |       }}
 92 |     >
 93 |       {code}
 94 |     </SyntaxHighlighter>
 95 |   );
 96 | };
 97 | 
 98 | const packgesToInject = `
 99 | <script src="https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
100 | <script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"></script>
101 | `;
102 | 
103 | const codeToInject = `
104 | <script>
105 |   async function handleCaptureSelection(selection) {
106 |     const [selectionCanvas, artifactCanvas] = await Promise.all([
107 |       html2canvas(document.body, {
108 |         x: selection.x,
109 |         y: selection.y,
110 |         width: selection.width,
111 |         height: selection.height,
112 |         logging: false,
113 |         useCORS: true,
114 |       }),
115 |       html2canvas(document.body),
116 |     ]);
117 | 
118 |     const selectionImg = selectionCanvas.toDataURL("image/png");
119 |     const artifactImg = artifactCanvas.toDataURL("image/png");
120 | 
121 |     window.parent.postMessage(
122 |       {
123 |         type: "SELECTION_DATA",
124 |         data: { selectionImg, artifactImg },
125 |       },
126 |       "*"
127 |     );
128 |   }
129 | 
130 |   function handleMessage(event) {
131 |     if (event?.data?.type === "CAPTURE_SELECTION") {
132 |       handleCaptureSelection(event.data.selection);
133 |     }
134 |   }
135 | 
136 |   window.addEventListener("message", handleMessage);
137 | </script>
138 | `;
139 | 
140 | const headOpeningTag = "<head>";
141 | const bodyClosingTag = "</body>";
142 | 
143 | const modifySrcDoc = (srcDoc: string) => {
144 |   // copy srcDoc into new string
145 |   let result = srcDoc;
146 | 
147 |   // Add packages inside head tag
148 |   const headOpeningTagIndex = result.indexOf(headOpeningTag);
149 |   if (headOpeningTagIndex === -1) return result;
150 | 
151 |   result =
152 |     result.slice(0, headOpeningTagIndex) +
153 |     packgesToInject +
154 |     result.slice(headOpeningTagIndex + headOpeningTag.length);
155 | 
156 |   // Add code inside body tag
157 |   const bodyClosingTagIndex = result.indexOf(bodyClosingTag);
158 |   if (bodyClosingTagIndex === -1) return result;
159 | 
160 |   result =
161 |     result.slice(0, bodyClosingTagIndex) +
162 |     codeToInject +
163 |     result.slice(bodyClosingTagIndex + bodyClosingTag.length);
164 | 
165 |   return result;
166 | };
167 | 


--------------------------------------------------------------------------------
/components/artifact/index.tsx:
--------------------------------------------------------------------------------
  1 | "use client";
  2 | 
  3 | import { ReactArtifact } from "@/components/artifact/react";
  4 | import { CodeBlock } from "@/components/markdown/code-block";
  5 | import Markdown from "@/components/markdown/markdown";
  6 | import SelectionTool from "@/components/selection-tool";
  7 | import { Button } from "@/components/ui/button";
  8 | import {
  9 |   Card,
 10 |   CardContent,
 11 |   CardDescription,
 12 |   CardFooter,
 13 |   CardHeader,
 14 |   CardTitle,
 15 | } from "@/components/ui/card";
 16 | import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
 17 | import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
 18 | import { ArtifactMessagePartData } from "@/lib/utils";
 19 | import { CheckIcon, ClipboardIcon, XIcon } from "lucide-react";
 20 | import { useState } from "react";
 21 | import { Props as ReactArtifactProps } from "@/components/artifact/react";
 22 | import { HTMLArtifact } from "@/components/artifact/html";
 23 | 
 24 | type Props = {
 25 |   onClose: () => void;
 26 |   recording: boolean;
 27 |   onCapture: ReactArtifactProps["onCapture"];
 28 | } & ArtifactMessagePartData;
 29 | 
 30 | export type ArtifactMode = "code" | "preview";
 31 | 
 32 | const artifactPreviewSupportedTypes = ["text/html", "application/react"];
 33 | 
 34 | export const ArtifactPanel = ({
 35 |   type,
 36 |   title,
 37 |   language,
 38 |   content,
 39 |   onClose,
 40 |   recording,
 41 |   onCapture,
 42 |   generating,
 43 | }: Props) => {
 44 |   const [mode, setMode] = useState<ArtifactMode>("code");
 45 | 
 46 |   const { isCopied, copyToClipboard } = useCopyToClipboard({
 47 |     timeout: 2000,
 48 |   });
 49 | 
 50 |   const onCopy = () => {
 51 |     if (isCopied) return;
 52 |     copyToClipboard(content);
 53 |   };
 54 | 
 55 |   console.log({ type, title, language, content });
 56 | 
 57 |   return (
 58 |     <Card className="w-full border-none rounded-none flex flex-col h-full max-h-full">
 59 |       <CardHeader className="bg-slate-50 rounded-lg border rounded-b-none py-2 px-4 flex flex-row items-center gap-4 justify-between space-y-0">
 60 |         <span className="font-semibold">{title || "Generating..."}</span>
 61 | 
 62 |         <div className="flex gap-2 items-center">
 63 |           {type &&
 64 |             artifactPreviewSupportedTypes.includes(type) &&
 65 |             !generating && (
 66 |               <Tabs
 67 |                 value={mode}
 68 |                 onValueChange={(value) => setMode(value as ArtifactMode)}
 69 |               >
 70 |                 <TabsList className="bg-slate-200">
 71 |                   <TabsTrigger value="preview">Preview</TabsTrigger>
 72 |                   <TabsTrigger value="code">Code</TabsTrigger>
 73 |                 </TabsList>
 74 |               </Tabs>
 75 |             )}
 76 | 
 77 |           <Button onClick={onClose} size="icon" variant="ghost">
 78 |             <XIcon className="w-4 h-4" />
 79 |           </Button>
 80 |         </div>
 81 |       </CardHeader>
 82 | 
 83 |       <CardContent
 84 |         id="artifact-content"
 85 |         className="border-l border-r p-0 w-full flex-1 max-h-full overflow-hidden relative"
 86 |       >
 87 |         {type === "text/markdown" && (
 88 |           <Markdown
 89 |             text={content}
 90 |             className="h-full max-h-full overflow-auto py-4 px-4"
 91 |           />
 92 |         )}
 93 | 
 94 |         {type === "application/code" && language && (
 95 |           <CodeBlock
 96 |             language={language}
 97 |             value={content}
 98 |             showHeader={false}
 99 |             className="h-full max-h-full overflow-auto"
100 |           />
101 |         )}
102 | 
103 |         {type === "application/react" && (
104 |           <ReactArtifact
105 |             code={content}
106 |             mode={mode}
107 |             recording={recording}
108 |             onCapture={onCapture}
109 |           />
110 |         )}
111 | 
112 |         {type === "text/html" && (
113 |           <HTMLArtifact
114 |             code={content}
115 |             mode={mode}
116 |             recording={recording}
117 |             onCapture={onCapture}
118 |           />
119 |         )}
120 |       </CardContent>
121 | 
122 |       <CardFooter className="bg-slate-50 border rounded-lg rounded-t-none py-2 px-4 flex items-center flex-row-reverse gap-4">
123 |         <Button
124 |           onClick={onCopy}
125 |           size="icon"
126 |           variant="outline"
127 |           className="w-8 h-8"
128 |         >
129 |           {isCopied ? (
130 |             <CheckIcon className="w-4 h-4" />
131 |           ) : (
132 |             <ClipboardIcon className="w-4 h-4" />
133 |           )}
134 |         </Button>
135 |       </CardFooter>
136 |     </Card>
137 |   );
138 | };
139 | 


--------------------------------------------------------------------------------
/components/artifact/react.tsx:
--------------------------------------------------------------------------------
  1 | "use client";
  2 | 
  3 | import SelectionTool from "@/components/selection-tool";
  4 | import React, { useEffect, useRef, useState } from "react";
  5 | import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
  6 | import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
  7 | import { Props as SelectionToolProps } from "@/components/selection-tool";
  8 | 
  9 | export type Props = {
 10 |   code: string;
 11 |   mode: "preview" | "code";
 12 |   recording: boolean;
 13 |   onCapture: (params: { selectionImg: string; artifactImg: string }) => void;
 14 | };
 15 | 
 16 | export const ReactArtifact = ({ code, mode, recording, onCapture }: Props) => {
 17 |   const contentRef = useRef<HTMLDivElement>(null);
 18 |   const iframeRef = useRef<HTMLIFrameElement>(null);
 19 |   const [iframeLoaded, setIframeLoaded] = useState(false);
 20 | 
 21 |   const handleRender = () => {
 22 |     if (!iframeRef.current?.contentWindow) return;
 23 | 
 24 |     iframeRef.current?.contentWindow?.postMessage(
 25 |       {
 26 |         type: "UPDATE_COMPONENT",
 27 |         code,
 28 |       },
 29 |       "*"
 30 |     );
 31 |   };
 32 | 
 33 |   const handleSendCaptureMessage: SelectionToolProps["onSelect"] = (
 34 |     selection
 35 |   ) => {
 36 |     if (!iframeRef.current?.contentWindow) return;
 37 | 
 38 |     iframeRef.current?.contentWindow?.postMessage(
 39 |       {
 40 |         type: "CAPTURE_SELECTION",
 41 |         selection,
 42 |       },
 43 |       "*"
 44 |     );
 45 |   };
 46 | 
 47 |   const handleMessage = (event: any) => {
 48 |     if (event?.data?.type === "INIT_COMPLETE") {
 49 |       setIframeLoaded(true);
 50 |       handleRender();
 51 |     } else if (event?.data?.type === "SELECTION_DATA") {
 52 |       onCapture({
 53 |         selectionImg: event.data.data.selectionImg,
 54 |         artifactImg: event.data.data.artifactImg,
 55 |       });
 56 |     }
 57 |   };
 58 | 
 59 |   useEffect(() => {
 60 |     window.addEventListener("message", handleMessage);
 61 | 
 62 |     return () => window.removeEventListener("message", handleMessage);
 63 |   }, []);
 64 | 
 65 |   useEffect(() => {
 66 |     handleRender();
 67 |   }, [code]);
 68 | 
 69 |   if (mode === "preview") {
 70 |     return (
 71 |       <>
 72 |         <div ref={contentRef} className="w-full h-full">
 73 |           <iframe
 74 |             ref={iframeRef}
 75 |             src={process.env.NEXT_PUBLIC_ARTIFACT_RENDERER_URL}
 76 |             className="w-full h-full"
 77 |             loading="lazy"
 78 |           />
 79 |         </div>
 80 | 
 81 |         {recording && iframeLoaded && (
 82 |           <SelectionTool
 83 |             targetRef={contentRef}
 84 |             onSelect={handleSendCaptureMessage}
 85 |           />
 86 |         )}
 87 |       </>
 88 |     );
 89 |   }
 90 | 
 91 |   return (
 92 |     <SyntaxHighlighter
 93 |       language="tsx"
 94 |       style={oneDark}
 95 |       customStyle={{
 96 |         margin: 0,
 97 |         borderRadius: 0,
 98 |         width: "100%",
 99 |         overflow: "auto",
100 |         height: "100%",
101 |         maxHeight: "100%",
102 |       }}
103 |       codeTagProps={{
104 |         style: {
105 |           fontSize: "0.9rem",
106 |           fontFamily: "var(--font-inter)",
107 |         },
108 |       }}
109 |     >
110 |       {code}
111 |     </SyntaxHighlighter>
112 |   );
113 | };
114 | 


--------------------------------------------------------------------------------
/components/auth-form-footers.tsx:
--------------------------------------------------------------------------------
 1 | import Link from "next/link";
 2 | 
 3 | export const SignInFooter = () => {
 4 |   return (
 5 |     <p className="text-sm text-muted-foreground">
 6 |       Already have an account?{" "}
 7 |       <Link href="/signin" className="hover:underline text-foreground">
 8 |         Sign In
 9 |       </Link>
10 |     </p>
11 |   );
12 | };
13 | 
14 | export const SignUpFooter = () => {
15 |   return (
16 |     <p className="text-sm text-muted-foreground">
17 |       Don&apos;t have an account?{" "}
18 |       <Link href="/signup" className="hover:underline text-foreground">
19 |         Sign Up
20 |       </Link>
21 |     </p>
22 |   );
23 | };
24 | 
25 | export const ForgotPasswordFooter = () => {
26 |   return (
27 |     <p className="text-sm">
28 |       <Link href="/forgot-password" className="hover:underline">
29 |         Forgot your password?
30 |       </Link>
31 |     </p>
32 |   );
33 | };
34 | 


--------------------------------------------------------------------------------
/components/chat/attachment-preview-button.tsx:
--------------------------------------------------------------------------------
 1 | /* eslint-disable @next/next/no-img-element */
 2 | import { Attachment } from "@/app/types";
 3 | import { Dialog, DialogContent } from "@/components/ui";
 4 | import { XIcon } from "lucide-react";
 5 | import { useState } from "react";
 6 | 
 7 | type Props = {
 8 |   value: Attachment;
 9 |   onRemove?: (value: Attachment) => void;
10 | };
11 | 
12 | export const AttachmentPreviewButton = ({ value, onRemove }: Props) => {
13 |   const [isPreviewOpen, setIsPreviewOpen] = useState(false);
14 | 
15 |   if (!value.contentType?.startsWith("image")) return null;
16 | 
17 |   return (
18 |     <div className="group relative inline-block text-sm text-token-text-primary">
19 |       <div className="relative overflow-hidden rounded-xl border border-token-border-light bg-token-main-surface-primary h-14 w-14">
20 |         <button
21 |           className="h-full w-full"
22 |           onClick={() => setIsPreviewOpen(true)}
23 |         >
24 |           <span
25 |             style={{
26 |               backgroundImage: `url(${value.url})`,
27 |             }}
28 |             className="flex items-center h-full w-full justify-center bg-gray-500 dark:bg-gray-700 bg-cover bg-center text-white"
29 |           ></span>
30 |         </button>
31 |       </div>
32 | 
33 |       {onRemove && (
34 |         <button
35 |           onClick={() => onRemove(value)}
36 |           className="bg-white absolute right-1 top-1 -translate-y-1/2 translate-x-1/2 rounded-full border border-token-border-heavy bg-token-main-surface-secondary p-0.5 text-token-text-primary transition-colors hover:opacity-100 group-hover:opacity-100 md:opacity-0"
37 |         >
38 |           <XIcon className="w-4 h-4" />
39 |         </button>
40 |       )}
41 | 
42 |       <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
43 |         <DialogContent className="max-w-full max-h-full w-screen h-screen z-[1000]">
44 |           <div className="relative w-full h-full flex items-center justify-center">
45 |             <img
46 |               src={value.url}
47 |               alt={value.name || ""}
48 |               className="max-w-full max-h-full object-contain"
49 |             />
50 |           </div>
51 |         </DialogContent>
52 |       </Dialog>
53 |     </div>
54 |   );
55 | };
56 | 


--------------------------------------------------------------------------------
/components/chat/input.tsx:
--------------------------------------------------------------------------------
  1 | import { Button } from "@/components/ui/button";
  2 | import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
  3 | import {
  4 |   ArrowDownIcon,
  5 |   ArrowUpIcon,
  6 |   CircleStopIcon,
  7 |   Loader2Icon,
  8 |   MicIcon,
  9 |   PaperclipIcon,
 10 |   PauseIcon,
 11 | } from "lucide-react";
 12 | import { useEffect, useRef, useState } from "react";
 13 | import Textarea from "react-textarea-autosize";
 14 | import {
 15 |   Select,
 16 |   SelectContent,
 17 |   SelectItem,
 18 |   SelectTrigger,
 19 |   SelectValue,
 20 | } from "@/components/ui/select";
 21 | import { Attachment, Models } from "@/app/types";
 22 | import { getSettings, updateSettings } from "@/lib/userSettings";
 23 | import { AttachmentPreviewButton } from "@/components/chat/attachment-preview-button";
 24 | import {
 25 |   Tooltip,
 26 |   TooltipContent,
 27 |   TooltipProvider,
 28 |   TooltipTrigger,
 29 | } from "@/components/ui";
 30 | import { convertFileToBase64 } from "@/lib/utils";
 31 | 
 32 | export type Props = {
 33 |   input: string;
 34 |   setInput: (value: string) => void;
 35 |   onSubmit: () => void;
 36 |   isLoading: boolean;
 37 |   recording: boolean;
 38 |   onStartRecord: () => void;
 39 |   onStopRecord: () => void;
 40 |   attachments: Attachment[];
 41 |   onRemoveAttachment: (attachment: Attachment) => void;
 42 |   onAddAttachment: (newAttachments: Attachment[]) => void;
 43 |   showScrollButton: boolean;
 44 |   handleManualScroll: () => void;
 45 |   stopGenerating: () => void;
 46 | };
 47 | 
 48 | export const ChatInput = ({
 49 |   input,
 50 |   setInput,
 51 |   onSubmit,
 52 |   isLoading,
 53 |   recording,
 54 |   onStartRecord,
 55 |   onStopRecord,
 56 |   attachments,
 57 |   onRemoveAttachment,
 58 |   onAddAttachment,
 59 |   showScrollButton,
 60 |   handleManualScroll,
 61 |   stopGenerating,
 62 | }: Props) => {
 63 |   const inputRef = useRef<HTMLTextAreaElement>(null);
 64 |   const { onKeyDown } = useEnterSubmit({ onSubmit });
 65 |   const [model, setModel] = useState<Models>(getSettings().model);
 66 |   const fileInputRef = useRef<HTMLInputElement>(null);
 67 | 
 68 |   // Handle file upload button click
 69 |   const handleFileUpload = () => {
 70 |     fileInputRef.current?.click();
 71 |   };
 72 | 
 73 |   // Handle file selection and conversion to base64
 74 |   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 75 |     if (e.target.files) {
 76 |       const filesArray = Array.from(e.target.files);
 77 |       const newAttachments = await Promise.all(
 78 |         filesArray.map(async (file) => ({
 79 |           url: await convertFileToBase64(file),
 80 |           name: file.name,
 81 |           contentType: file.type,
 82 |         }))
 83 |       );
 84 |       onAddAttachment(newAttachments);
 85 |     }
 86 |   };
 87 | 
 88 |   // Focus on input field when component mounts
 89 |   useEffect(() => {
 90 |     inputRef.current?.focus();
 91 |   }, []);
 92 | 
 93 |   // Handle model change and update settings
 94 |   const handleModelChange = (newModel: Models) => {
 95 |     setModel(newModel);
 96 |     updateSettings({ ...getSettings(), model: newModel });
 97 |   };
 98 | 
 99 |   return (
100 |     <div className="sticky bottom-0 mx-auto w-full pt-6 flex flex-col gap-4 items-center">
101 |       {showScrollButton && (
102 |         <Button
103 |           onClick={handleManualScroll}
104 |           variant="outline"
105 |           size="icon"
106 |           className="rounded-full shadow-lg w-8 h-8"
107 |         >
108 |           <ArrowDownIcon className="h-4 w-4" />
109 |         </Button>
110 |       )}
111 | 
112 |       <div className="w-full flex flex-col gap-1 bg-[#F4F4F4] p-2.5 pl-4 rounded-md border border-b-0 rounded-b-none shadow-md">
113 |         {/* Attachment preview */}
114 |         {attachments && (
115 |           <div className="flex items-center gap-2 mb-2">
116 |             {attachments.map((attachment, index) => (
117 |               <AttachmentPreviewButton
118 |                 key={index}
119 |                 value={attachment}
120 |                 onRemove={onRemoveAttachment}
121 |               />
122 |             ))}
123 |           </div>
124 |         )}
125 | 
126 |         <div className="flex gap-2 items-start">
127 |           {/* Main input textarea */}
128 |           <Textarea
129 |             ref={inputRef}
130 |             tabIndex={0}
131 |             onKeyDown={onKeyDown}
132 |             placeholder="Send a message."
133 |             className="min-h-15 max-h-96 overflow-auto w-full bg-transparent border-none resize-none focus-within:outline-none"
134 |             autoFocus
135 |             spellCheck={false}
136 |             autoComplete="off"
137 |             autoCorrect="off"
138 |             name="message"
139 |             rows={1}
140 |             value={input}
141 |             onChange={(e) => setInput(e.target.value)}
142 |           />
143 | 
144 |           {/* Hidden file input */}
145 |           <input
146 |             type="file"
147 |             accept="image/*"
148 |             multiple
149 |             ref={fileInputRef}
150 |             style={{ display: "none" }}
151 |             onChange={handleFileChange}
152 |           />
153 | 
154 |           {/* File upload button */}
155 |           <Button
156 |             variant="outline"
157 |             size="icon"
158 |             className="w-8 h-8 bg-transparent"
159 |             onClick={handleFileUpload}
160 |           >
161 |             <PaperclipIcon className="w-4 h-4" />
162 |           </Button>
163 | 
164 |           {/* Voice recording button */}
165 |           <TooltipProvider>
166 |             <Tooltip>
167 |               <TooltipTrigger asChild>
168 |                 <Button
169 |                   onClick={() => (recording ? onStopRecord() : onStartRecord())}
170 |                   size="icon"
171 |                   variant="outline"
172 |                   className="w-8 h-8 bg-transparent disabled:pointer-events-auto"
173 |                 >
174 |                   {recording ? (
175 |                     <PauseIcon className="w-4 h-4" />
176 |                   ) : (
177 |                     <MicIcon className="w-4 h-4" />
178 |                   )}
179 |                 </Button>
180 |               </TooltipTrigger>
181 |               <TooltipContent>
182 |                 <p>
183 |                   {getSettings().openaiApiKey
184 |                     ? "Click to record voice and crop artifacts for editing"
185 |                     : "Missing OpenAI API Key in Settings for Speech to Text"}
186 |                 </p>
187 |               </TooltipContent>
188 |             </Tooltip>
189 |           </TooltipProvider>
190 | 
191 |           {/* Submit button */}
192 |           <Button
193 |             onClick={isLoading ? stopGenerating : onSubmit}
194 |             size="icon"
195 |             className="w-8 h-8"
196 |           >
197 |             {isLoading ? (
198 |               <CircleStopIcon className="w-4 h-4" />
199 |             ) : (
200 |               <ArrowUpIcon className="w-4 h-4" />
201 |             )}
202 |           </Button>
203 |         </div>
204 | 
205 |         {/* Model selection dropdown */}
206 |         <Select value={model || undefined} onValueChange={handleModelChange}>
207 |           <SelectTrigger className="w-fit bg-[#F4F4F4] flex items-center gap-2 border-none">
208 |             <SelectValue placeholder="Select Model" />
209 |           </SelectTrigger>
210 |           <SelectContent className="w-fit">
211 |             <SelectItem value={Models.claude}>Claude Sonnet</SelectItem>
212 |             <SelectItem value={Models.gpt4oMini}>GPT-4o Mini</SelectItem>
213 |             <SelectItem value={Models.gpt4o}>GPT-4o</SelectItem>
214 |             <SelectItem value={Models.gpt4turbo}>GPT-4 Turbo</SelectItem>
215 |             <SelectItem value={Models.gpt35turbo}>GPT-3.5 Turbo</SelectItem>
216 |           </SelectContent>
217 |         </Select>
218 |       </div>
219 |     </div>
220 |   );
221 | };
222 | 


--------------------------------------------------------------------------------
/components/chat/message-list.tsx:
--------------------------------------------------------------------------------
 1 | "use client";
 2 | 
 3 | import { Models } from "@/app/types";
 4 | import { ChatMessage } from "@/components/chat/message";
 5 | import { Separator } from "@/components/ui/separator";
 6 | import { ArtifactMessagePartData } from "@/lib/utils";
 7 | import { Message } from "ai";
 8 | import { RefObject } from "react";
 9 | 
10 | type Props = {
11 |   messages: Message[];
12 |   setCurrentArtifact: (data: ArtifactMessagePartData) => void;
13 |   containerRef: RefObject<HTMLDivElement>;
14 | };
15 | 
16 | export const ChatMessageList = ({
17 |   messages,
18 |   setCurrentArtifact,
19 |   containerRef,
20 | }: Props) => {
21 |   return (
22 |     <div
23 |       ref={containerRef}
24 |       className="flex-1 flex flex-col gap-4 max-w-3xl mx-auto w-full pt-1"
25 |     >
26 |       {messages.map((message, index) => (
27 |         <>
28 |           <ChatMessage
29 |             key={index}
30 |             role={message.role}
31 |             model={Models.claude}
32 |             text={message.content}
33 |             attachments={message.experimental_attachments || []}
34 |             setCurrentArtifact={setCurrentArtifact}
35 |           />
36 | 
37 |           {index !== messages.length - 1 && <Separator />}
38 |         </>
39 |       ))}
40 |     </div>
41 |   );
42 | };
43 | 


--------------------------------------------------------------------------------
/components/chat/message.tsx:
--------------------------------------------------------------------------------
  1 | "use client";
  2 | 
  3 | import { Attachment, ChatMessageRoles, Models } from "@/app/types";
  4 | import { AttachmentPreviewButton } from "@/components/chat/attachment-preview-button";
  5 | import Markdown from "@/components/markdown/markdown";
  6 | import { Button } from "@/components/ui/button";
  7 | import {
  8 |   ArtifactMessagePartData,
  9 |   MessagePart as MessagePartType,
 10 |   parseMessage,
 11 | } from "@/lib/utils";
 12 | import { BotIcon, CodeIcon, Loader2Icon, UserIcon } from "lucide-react";
 13 | 
 14 | const getDisplayNameFromRole = (
 15 |   role: ChatMessageRoles,
 16 |   model: Models | null
 17 | ) => {
 18 |   if (role === "user") return "Me";
 19 | 
 20 |   switch (model) {
 21 |     case Models.claude:
 22 |       return "Claude";
 23 | 
 24 |     case Models.gpt4o:
 25 |       return "GPT 4o";
 26 | 
 27 |     default:
 28 |       return model;
 29 |   }
 30 | };
 31 | 
 32 | type Props = {
 33 |   role: ChatMessageRoles;
 34 |   model: Models | null;
 35 |   text: string;
 36 |   setCurrentArtifact: (data: ArtifactMessagePartData) => void;
 37 |   attachments: Attachment[];
 38 | };
 39 | 
 40 | export const ChatMessage = ({
 41 |   role,
 42 |   text,
 43 |   attachments,
 44 |   setCurrentArtifact,
 45 | }: Props) => {
 46 |   return (
 47 |     <div
 48 |       className={`flex items-start gap-2 px-2 py-2 rounded-md ${
 49 |         role === "tool" ? "bg-[#F4F4F4]" : "bg-white"
 50 |       }`}
 51 |     >
 52 |       <div
 53 |         className={`border rounded-md p-1 ${
 54 |           role === "user" ? "bg-white" : "bg-black border-black"
 55 |         }`}
 56 |       >
 57 |         {role === "user" ? (
 58 |           <UserIcon size={20} />
 59 |         ) : (
 60 |           <BotIcon size={20} color="white" />
 61 |         )}
 62 |       </div>
 63 | 
 64 |       <div className="flex flex-col gap-2">
 65 |         {attachments.length > 0 && (
 66 |           <div className="flex items-center gap-2 flex-wrap">
 67 |             {attachments.map((attachment, index) => (
 68 |               <AttachmentPreviewButton key={index} value={attachment} />
 69 |             ))}
 70 |           </div>
 71 |         )}
 72 | 
 73 |         {role === "user" && <Markdown text={text} />}
 74 | 
 75 |         {role === "assistant" &&
 76 |           parseMessage(text).map((part, index) => (
 77 |             <MessagePart
 78 |               data={part}
 79 |               key={index}
 80 |               setCurrentArtifact={setCurrentArtifact}
 81 |             />
 82 |           ))}
 83 |       </div>
 84 |     </div>
 85 |   );
 86 | };
 87 | 
 88 | const MessagePart = ({
 89 |   data,
 90 |   setCurrentArtifact,
 91 | }: {
 92 |   data: MessagePartType;
 93 |   setCurrentArtifact: (data: ArtifactMessagePartData) => void;
 94 | }) => {
 95 |   if (data.type === "text") return <Markdown text={data.data} />;
 96 | 
 97 |   if (data.type === "artifact")
 98 |     return (
 99 |       <Button
100 |         variant="outline"
101 |         className="flex justify-start h-fit w-fit py-0 px-0 my-2"
102 |         onClick={() => setCurrentArtifact(data.data)}
103 |       >
104 |         <div className="w-14 h-full flex items-center justify-center border-r">
105 |           {data.data.generating ? (
106 |             <Loader2Icon className="animate-spin" />
107 |           ) : (
108 |             <CodeIcon />
109 |           )}
110 |         </div>
111 | 
112 |         <div className="flex flex-col gap-0.5 items-start px-4 py-3">
113 |           <span className="break-words text-md font-semibold leading-tight">
114 |             {data.data?.title || "Generating"}
115 |           </span>
116 |           <span className="text-text-400 line-clamp-1 text-xs">
117 |             {data.data?.content ? "Click to show code" : ""}
118 |           </span>
119 |         </div>
120 |       </Button>
121 |     );
122 | 
123 |   return null;
124 | };
125 | 


--------------------------------------------------------------------------------
/components/chat/panel.tsx:
--------------------------------------------------------------------------------
  1 | "use client";
  2 | 
  3 | import { ArtifactPanel } from "@/components/artifact";
  4 | import { ChatInput, Props as ChatInputProps } from "@/components/chat/input";
  5 | import { ChatMessageList } from "@/components/chat/message-list";
  6 | import { Message, useChat } from "ai/react";
  7 | import { getSettings } from "@/lib/userSettings";
  8 | import { addMessage, createChat, getChatMessages } from "@/lib/db";
  9 | import { Loader2Icon } from "lucide-react";
 10 | import { useMutation, useQueryClient } from "@tanstack/react-query";
 11 | import { useSupabase } from "@/lib/supabase";
 12 | import { Chat, Models, Attachment } from "@/app/types";
 13 | import { ArtifactMessagePartData } from "@/lib/utils";
 14 | import toast from "react-hot-toast";
 15 | import { useRouter } from "next/navigation";
 16 | import { useWhisper as useRealWhisper } from "@chengsokdara/use-whisper";
 17 | import { Props as ReactArtifactProps } from "@/components/artifact/react";
 18 | import { useEffect, useState } from "react";
 19 | import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor";
 20 | import { useFakeWhisper } from "@/lib/hooks/use-fake-whisper";
 21 | 
 22 | type Props = {
 23 |   id: string | null;
 24 | };
 25 | 
 26 | export const ChatPanel = ({ id }: Props) => {
 27 |   // Get settings and supabase instance
 28 |   const settings = getSettings();
 29 |   const { supabase, session } = useSupabase();
 30 |   const queryClient = useQueryClient();
 31 |   const router = useRouter();
 32 | 
 33 |   // State management
 34 |   const [chatId, setChatId] = useState(id);
 35 |   const [initialMessages, setInitialMessages] = useState<Message[]>([]);
 36 |   const [fetchingMessages, setFetchingMessages] = useState(false);
 37 |   const [currentArtifact, setCurrentArtifact] =
 38 |     useState<ArtifactMessagePartData | null>(null);
 39 |   const [attachments, setAttachments] = useState<Attachment[]>([]);
 40 |   const [selectedArtifacts, setSelectedArtifacts] = useState<string[]>([]);
 41 | 
 42 |   // Fetch messages for existing chat
 43 |   const fetchMessages = async () => {
 44 |     if (chatId) {
 45 |       setFetchingMessages(true);
 46 |       const messages = await getChatMessages(supabase, chatId);
 47 |       setInitialMessages(
 48 |         messages.map((message) => ({
 49 |           id: String(message.id),
 50 |           role: message.role as Message["role"],
 51 |           content: message.text,
 52 |           experimental_attachments: (message.attachments as Attachment[]) || [],
 53 |         }))
 54 |       );
 55 |       setFetchingMessages(false);
 56 |     } else {
 57 |       setInitialMessages([]);
 58 |     }
 59 |   };
 60 | 
 61 |   useEffect(() => {
 62 |     fetchMessages();
 63 |   }, []);
 64 | 
 65 |   // Create new chat mutation
 66 |   const createChatMutation = useMutation({
 67 |     mutationFn: async ({
 68 |       title,
 69 |     }: {
 70 |       title: string;
 71 |       firstMessage: Message;
 72 |       secondMessage: Message;
 73 |     }) => await createChat(supabase, title, session?.user.id),
 74 |     onSuccess: async (newChat, { firstMessage, secondMessage }) => {
 75 |       queryClient.setQueryData<Chat[]>(["chats"], (oldChats) => {
 76 |         return [...(oldChats || []), newChat];
 77 |       });
 78 |       setChatId(newChat.id);
 79 | 
 80 |       await addMessage(supabase, newChat.id, firstMessage);
 81 |       await addMessage(supabase, newChat.id, secondMessage);
 82 | 
 83 |       router.push(`/chat/${newChat.id}`);
 84 |     },
 85 |   });
 86 | 
 87 |   // Chat hook setup
 88 |   const {
 89 |     messages,
 90 |     input,
 91 |     setInput,
 92 |     append,
 93 |     stop: stopGenerating,
 94 |     isLoading: generatingResponse,
 95 |   } = useChat({
 96 |     initialMessages,
 97 |     onFinish: async (message) => {
 98 |       if (chatId) {
 99 |         await addMessage(supabase, chatId, message);
100 |       }
101 |     },
102 |     sendExtraMessageFields: true,
103 |   });
104 | 
105 |   // Scroll as new messages are added
106 |   const { messagesRef, scrollRef, showScrollButton, handleManualScroll } =
107 |     useScrollAnchor(messages);
108 | 
109 |   // Create new chat when conditions are met
110 |   useEffect(() => {
111 |     if (!chatId && messages.length === 2 && !generatingResponse) {
112 |       createChatMutation.mutate({
113 |         title: messages[0].content.slice(0, 100),
114 |         firstMessage: messages[0],
115 |         secondMessage: messages[1],
116 |       });
117 |     }
118 |   }, [chatId, messages, generatingResponse]);
119 | 
120 |   // Whisper hook setup for voice input
121 |   const useWhispherHook = getSettings().openaiApiKey
122 |     ? useRealWhisper
123 |     : useFakeWhisper;
124 |   const { recording, transcribing, transcript, startRecording, stopRecording } =
125 |     useWhispherHook({
126 |       apiKey: getSettings().openaiApiKey,
127 |     });
128 | 
129 |   // Update input with transcribed text
130 |   useEffect(() => {
131 |     if (!recording && !transcribing && transcript?.text) {
132 |       setInput((prev) => prev + ` ${transcript.text}`);
133 |     }
134 |   }, [recording, transcribing, transcript?.text, setInput]);
135 | 
136 |   // Handle artifact capture
137 |   const handleCapture: ReactArtifactProps["onCapture"] = ({
138 |     selectionImg,
139 |     artifactImg,
140 |   }) => {
141 |     setAttachments((prev) => [
142 |       ...prev,
143 |       {
144 |         contentType: "image/png",
145 |         url: selectionImg,
146 |       },
147 |     ]);
148 | 
149 |     setSelectedArtifacts((prev) => {
150 |       if (prev.includes(artifactImg)) return prev;
151 |       return [...prev, artifactImg];
152 |     });
153 |   };
154 | 
155 |   // Handle attachment management
156 |   const handleAddAttachment: ChatInputProps["onAddAttachment"] = (
157 |     newAttachments
158 |   ) => {
159 |     setAttachments((prev) => [...prev, ...newAttachments]);
160 |   };
161 | 
162 |   const handleRemoveAttachment: ChatInputProps["onRemoveAttachment"] = (
163 |     attachment
164 |   ) => {
165 |     setAttachments((prev) =>
166 |       prev.filter((item) => item.url !== attachment.url)
167 |     );
168 |   };
169 | 
170 |   // Handle sending messages
171 |   const handleSend = async () => {
172 |     const query = input.trim();
173 |     if (!query) return;
174 | 
175 |     const settings = getSettings();
176 | 
177 |     if (settings.model === Models.claude && !settings.anthropicApiKey) {
178 |       toast.error("Please enter your Claude API Key");
179 |       return;
180 |     }
181 | 
182 |     if (settings.model.startsWith("gpt") && !settings.openaiApiKey) {
183 |       toast.error("Please enter your OpenAI API Key");
184 |       return;
185 |     }
186 | 
187 |     const messageAttachments = [
188 |       ...attachments
189 |         .filter((item) => item.contentType?.startsWith("image"))
190 |         .map((item) => ({ url: item.url, contentType: item.contentType })),
191 |       ...selectedArtifacts.map((url) => ({ url })),
192 |     ];
193 | 
194 |     append(
195 |       {
196 |         role: "user",
197 |         content: query,
198 |         experimental_attachments: messageAttachments,
199 |       },
200 |       {
201 |         body: {
202 |           model: settings.model,
203 |           apiKey: settings.model.startsWith("gpt")
204 |             ? settings.openaiApiKey
205 |             : settings.anthropicApiKey,
206 |         },
207 |       }
208 |     );
209 | 
210 |     setInput("");
211 |     stopRecording();
212 | 
213 |     if (chatId) {
214 |       await addMessage(
215 |         supabase,
216 |         chatId,
217 |         { role: "user", content: query },
218 |         attachments
219 |       );
220 |     }
221 | 
222 |     setAttachments([]);
223 |     setSelectedArtifacts([]);
224 |   };
225 | 
226 |   return (
227 |     <>
228 |       <div
229 |         className="relative flex w-full flex-1 overflow-x-hidden overflow-y-scroll pt-6"
230 |         ref={scrollRef}
231 |       >
232 |         <div className="relative mx-auto flex h-full w-full min-w-[400px] max-w-3xl flex-1 flex-col md:px-2">
233 |           {fetchingMessages && <Loader2Icon className="animate-spin mx-auto" />}
234 | 
235 |           <ChatMessageList
236 |             messages={messages}
237 |             setCurrentArtifact={setCurrentArtifact}
238 |             containerRef={messagesRef}
239 |           />
240 | 
241 |           <ChatInput
242 |             input={input}
243 |             setInput={setInput}
244 |             onSubmit={handleSend}
245 |             isLoading={generatingResponse}
246 |             recording={recording}
247 |             onStartRecord={startRecording}
248 |             onStopRecord={stopRecording}
249 |             attachments={attachments}
250 |             onAddAttachment={handleAddAttachment}
251 |             onRemoveAttachment={handleRemoveAttachment}
252 |             showScrollButton={showScrollButton}
253 |             handleManualScroll={handleManualScroll}
254 |             stopGenerating={stopGenerating}
255 |           />
256 |         </div>
257 |       </div>
258 | 
259 |       {currentArtifact && (
260 |         <div className="w-full max-w-xl h-full max-h-full pt-6 pb-4">
261 |           <ArtifactPanel
262 |             title={currentArtifact.title}
263 |             id={currentArtifact.id}
264 |             type={currentArtifact.type}
265 |             generating={currentArtifact.generating}
266 |             content={currentArtifact.content}
267 |             language={currentArtifact.language}
268 |             onClose={() => setCurrentArtifact(null)}
269 |             recording={recording}
270 |             onCapture={handleCapture}
271 |           />
272 |         </div>
273 |       )}
274 |     </>
275 |   );
276 | };
277 | 


--------------------------------------------------------------------------------
/components/homepage-link.tsx:
--------------------------------------------------------------------------------
 1 | import Link from "next/link";
 2 | 
 3 | export const HomePageLink = () => (
 4 |   <Link href="/">
 5 |     <h1 className="text-5xl font-bold tracking-tight text-[#131316] relative">
 6 |       Open Artifacts
 7 |     </h1>
 8 |   </Link>
 9 | );
10 | 


--------------------------------------------------------------------------------
/components/markdown/code-block.tsx:
--------------------------------------------------------------------------------
  1 | "use client";
  2 | 
  3 | import { Check, Copy, Download } from "lucide-react";
  4 | import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
  5 | import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
  6 | 
  7 | import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
  8 | import { twMerge } from "tailwind-merge";
  9 | 
 10 | interface Props {
 11 |   language: string;
 12 |   value: string;
 13 |   showHeader?: boolean;
 14 |   className?: string;
 15 | }
 16 | 
 17 | interface languageMap {
 18 |   [key: string]: string | undefined;
 19 | }
 20 | 
 21 | export const programmingLanguages: languageMap = {
 22 |   javascript: ".js",
 23 |   python: ".py",
 24 |   java: ".java",
 25 |   c: ".c",
 26 |   cpp: ".cpp",
 27 |   "c++": ".cpp",
 28 |   "c#": ".cs",
 29 |   ruby: ".rb",
 30 |   php: ".php",
 31 |   swift: ".swift",
 32 |   "objective-c": ".m",
 33 |   kotlin: ".kt",
 34 |   typescript: ".ts",
 35 |   go: ".go",
 36 |   perl: ".pl",
 37 |   rust: ".rs",
 38 |   scala: ".scala",
 39 |   haskell: ".hs",
 40 |   lua: ".lua",
 41 |   shell: ".sh",
 42 |   sql: ".sql",
 43 |   html: ".html",
 44 |   css: ".css",
 45 | };
 46 | 
 47 | export const generateRandomString = (length: number, lowercase = false) => {
 48 |   const chars = "ABCDEFGHJKLMNPQRSTUVWXY3456789"; // excluding similar looking characters like Z, 2, I, 1, O, 0
 49 |   let result = "";
 50 |   for (let i = 0; i < length; i++) {
 51 |     result += chars.charAt(Math.floor(Math.random() * chars.length));
 52 |   }
 53 |   return lowercase ? result.toLowerCase() : result;
 54 | };
 55 | 
 56 | const CodeBlock = ({
 57 |   language,
 58 |   value,
 59 |   showHeader = true,
 60 |   className = "",
 61 | }: Props) => {
 62 |   // * Copy to clipboard is used in multiple places, so using a custom hook
 63 |   const { isCopied, copyToClipboard } = useCopyToClipboard({
 64 |     timeout: 2000,
 65 |   });
 66 | 
 67 |   function onCopy() {
 68 |     if (isCopied) return;
 69 |     copyToClipboard(value);
 70 |   }
 71 | 
 72 |   const downloadAsFile = () => {
 73 |     const fileExtension = programmingLanguages[language] || ".file";
 74 |     const suggestedFileName = `file-${generateRandomString(
 75 |       3,
 76 |       true
 77 |     )}${fileExtension}`;
 78 |     const fileName = window.prompt("Enter file name" || "", suggestedFileName);
 79 | 
 80 |     if (!fileName) {
 81 |       // user pressed cancel on prompt
 82 |       return;
 83 |     }
 84 | 
 85 |     const blob = new Blob([value], { type: "text/plain" });
 86 |     const url = URL.createObjectURL(blob);
 87 |     const link = document.createElement("a");
 88 |     link.download = fileName;
 89 |     link.href = url;
 90 |     link.style.display = "none";
 91 |     document.body.appendChild(link);
 92 |     link.click();
 93 |     document.body.removeChild(link);
 94 |     URL.revokeObjectURL(url);
 95 |   };
 96 | 
 97 |   return (
 98 |     <div className={twMerge("codeblock relative w-full font-sans", className)}>
 99 |       {showHeader && (
100 |         <div className="flex items-center justify-between rounded-t-lg bg-zinc-700 px-4 py-1">
101 |           <span className="text-xs lowercase text-white">{language}</span>
102 |           <div className="flex items-center gap-2">
103 |             <button
104 |               aria-label="Copy code"
105 |               className="flex items-center gap-1.5 rounded bg-none p-1 text-xs text-white"
106 |               onClick={onCopy}
107 |             >
108 |               {isCopied ? (
109 |                 <Check className="size-4" aria-hidden="true" />
110 |               ) : (
111 |                 <Copy className="size-4" aria-hidden="true" />
112 |               )}
113 |               {isCopied ? "Copied!" : "Copy code"}
114 |             </button>
115 |             <button
116 |               aria-label="Download code"
117 |               className="flex items-center rounded bg-none p-1 text-xs text-white"
118 |               onClick={downloadAsFile}
119 |             >
120 |               <Download className="size-4" aria-hidden="true" />
121 |             </button>
122 |           </div>
123 |         </div>
124 |       )}
125 | 
126 |       <SyntaxHighlighter
127 |         language={language}
128 |         style={oneDark}
129 |         PreTag="div"
130 |         showLineNumbers
131 |         customStyle={{
132 |           margin: 0,
133 |           width: "100%",
134 |           padding: "1.5rem 1rem",
135 |           borderBottomLeftRadius: "8px",
136 |           borderBottomRightRadius: "8px",
137 |         }}
138 |         codeTagProps={{
139 |           style: {
140 |             fontSize: "0.9rem",
141 |             fontFamily: "var(--font-inter)",
142 |           },
143 |         }}
144 |       >
145 |         {value}
146 |       </SyntaxHighlighter>
147 |     </div>
148 |   );
149 | };
150 | 
151 | CodeBlock.displayName = "CodeBlock";
152 | 
153 | export { CodeBlock };
154 | 


--------------------------------------------------------------------------------
/components/markdown/markdown.tsx:
--------------------------------------------------------------------------------
 1 | "use client";
 2 | 
 3 | import React from "react";
 4 | import remarkGfm from "remark-gfm";
 5 | import { twMerge } from "tailwind-merge";
 6 | 
 7 | import { CodeBlock } from "@/components/markdown/code-block";
 8 | import { MemoizedReactMarkdown } from "@/components/markdown/memoized-react-markdownn";
 9 | 
10 | type Props = { text: string; className?: string };
11 | 
12 | export default function Markdown({ text, className = "" }: Props) {
13 |   return (
14 |     <MemoizedReactMarkdown
15 |       className={twMerge(
16 |         "prose text-black dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-none break-words",
17 |         className
18 |       )}
19 |       remarkPlugins={[remarkGfm]}
20 |       components={{
21 |         p({ children }) {
22 |           return <p className="mb-2 last:mb-0">{children}</p>;
23 |         },
24 |         a({ node, href, children, ...props }) {
25 |           const childrenArray = React.Children.toArray(children);
26 |           const childrenText = childrenArray
27 |             .map((child) => child?.toString() ?? "")
28 |             .join("");
29 | 
30 |           const cleanedText = childrenText.replace(/\[|\]/g, "");
31 |           const isNumber = /^\d+$/.test(cleanedText);
32 | 
33 |           return isNumber ? (
34 |             <a
35 |               href={href}
36 |               target="_blank"
37 |               rel="noreferrer"
38 |               {...props}
39 |               className="bg-mountain-meadow-100 hover:bg-mountain-meadow-100/80 dark:bg-colour-primary-800 dark:hover:bg-colour-primary-800/80 relative bottom-[6px] mx-0.5 rounded px-[5px] py-[2px] text-[8px] font-bold no-underline"
40 |             >
41 |               {children}
42 |             </a>
43 |           ) : (
44 |             <a
45 |               href={href}
46 |               target="_blank"
47 |               rel="noreferrer"
48 |               {...props}
49 |               className="hover:underline"
50 |             >
51 |               {children}
52 |             </a>
53 |           );
54 |         },
55 | 
56 |         code(props) {
57 |           const { children, className, node, ...rest } = props;
58 |           const match = /language-(\w+)/.exec(className || "");
59 |           return match ? (
60 |             <CodeBlock
61 |               key={crypto.randomUUID()}
62 |               language={(match && match[1]) || ""}
63 |               value={String(children).replace(/\n$/, "")}
64 |               {...props}
65 |             />
66 |           ) : (
67 |             <code {...rest} className={className}>
68 |               {children}
69 |             </code>
70 |           );
71 |         },
72 |       }}
73 |     >
74 |       {text}
75 |     </MemoizedReactMarkdown>
76 |   );
77 | }
78 | 


--------------------------------------------------------------------------------
/components/markdown/memoized-react-markdownn.tsx:
--------------------------------------------------------------------------------
 1 | import { type FC, memo } from "react";
 2 | import ReactMarkdown, { type Options } from "react-markdown";
 3 | 
 4 | export const MemoizedReactMarkdown: FC<Options> = memo(
 5 |   ReactMarkdown,
 6 |   (prevProps, nextProps) =>
 7 |     prevProps.children === nextProps.children &&
 8 |     prevProps.className === nextProps.className
 9 | );
10 | 


--------------------------------------------------------------------------------
/components/oauth-provider-button.tsx:
--------------------------------------------------------------------------------
 1 | import { OAuthProviders } from "@/app/types";
 2 | import { Button } from "@/components/ui";
 3 | import Image from "next/image";
 4 | import { ButtonHTMLAttributes } from "react";
 5 | import { twMerge } from "tailwind-merge";
 6 | 
 7 | type Props = {
 8 |   provider: OAuthProviders;
 9 | } & ButtonHTMLAttributes<HTMLButtonElement>;
10 | 
11 | export const OAuthProviderButton = ({
12 |   onClick,
13 |   className = "",
14 |   children,
15 |   provider,
16 | }: Props) => {
17 |   return (
18 |     <Button
19 |       onClick={onClick}
20 |       className={twMerge(
21 |         "w-full bg-white text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center justify-center",
22 |         className
23 |       )}
24 |     >
25 |       <Image
26 |         src={`/${provider}.svg`}
27 |         alt={provider}
28 |         width={20}
29 |         height={20}
30 |         className="mr-2"
31 |       />
32 | 
33 |       {children}
34 |     </Button>
35 |   );
36 | };
37 | 


--------------------------------------------------------------------------------
/components/selection-tool.tsx:
--------------------------------------------------------------------------------
  1 | import React, { useState, useCallback, useRef, RefObject } from "react";
  2 | 
  3 | export type SelectionRect = {
  4 |   x: number;
  5 |   y: number;
  6 |   width: number;
  7 |   height: number;
  8 | };
  9 | 
 10 | export type Props = {
 11 |   targetRef: RefObject<HTMLElement>;
 12 |   onSelect: (selectionRect: SelectionRect) => void;
 13 | };
 14 | 
 15 | const SelectionTool = ({ targetRef, onSelect }: Props) => {
 16 |   const [isSelecting, setIsSelecting] = useState(false);
 17 |   const [selectionRect, setSelectionRect] = useState<SelectionRect>({
 18 |     x: 0,
 19 |     y: 0,
 20 |     width: 0,
 21 |     height: 0,
 22 |   });
 23 |   const [startPos, setStartPos] = useState({ x: 0, y: 0 });
 24 |   const overlayRef = useRef<HTMLDivElement>(null);
 25 |   const selectionRef = useRef<HTMLDivElement>(null);
 26 | 
 27 |   const startSelection = useCallback((e: React.MouseEvent) => {
 28 |     if (!targetRef.current) return;
 29 | 
 30 |     const panelRect = targetRef.current.getBoundingClientRect();
 31 |     const x = e.clientX - panelRect.left;
 32 |     const y = e.clientY - panelRect.top;
 33 | 
 34 |     // Only start selection if the click is inside the ArtifactPanel
 35 |     if (x >= 0 && x <= panelRect.width && y >= 0 && y <= panelRect.height) {
 36 |       setIsSelecting(true);
 37 |       setStartPos({ x, y });
 38 |     }
 39 |   }, []);
 40 | 
 41 |   const updateSelection = useCallback(
 42 |     (e: React.MouseEvent) => {
 43 |       if (!isSelecting || !targetRef.current) return;
 44 | 
 45 |       const panelRect = targetRef.current.getBoundingClientRect();
 46 |       const currentX = Math.min(
 47 |         Math.max(e.clientX - panelRect.left, 0),
 48 |         panelRect.width
 49 |       );
 50 |       const currentY = Math.min(
 51 |         Math.max(e.clientY - panelRect.top, 0),
 52 |         panelRect.height
 53 |       );
 54 | 
 55 |       setSelectionRect({
 56 |         x: Math.min(currentX, startPos.x),
 57 |         y: Math.min(currentY, startPos.y),
 58 |         width: Math.abs(currentX - startPos.x),
 59 |         height: Math.abs(currentY - startPos.y),
 60 |       });
 61 |     },
 62 |     [isSelecting, startPos]
 63 |   );
 64 | 
 65 |   const endSelection = useCallback(() => {
 66 |     setIsSelecting(false);
 67 |     if (selectionRect.width > 10 && selectionRect.height > 10) {
 68 |       onSelect(selectionRect);
 69 |     }
 70 |   }, [selectionRect]);
 71 | 
 72 |   return (
 73 |     <div
 74 |       ref={overlayRef}
 75 |       style={{
 76 |         position: "absolute",
 77 |         top: 0,
 78 |         left: 0,
 79 |         width: "100%",
 80 |         height: "100%",
 81 |         backgroundColor: "rgba(0, 0, 0, 0.05)",
 82 |         cursor: "crosshair",
 83 |         zIndex: 999,
 84 |       }}
 85 |       onMouseDown={startSelection}
 86 |       onMouseMove={updateSelection}
 87 |       onMouseUp={endSelection}
 88 |     >
 89 |       {isSelecting && (
 90 |         <div
 91 |           ref={selectionRef}
 92 |           className="border-2 border-red-600"
 93 |           style={{
 94 |             position: "absolute",
 95 |             left: selectionRect.x,
 96 |             top: selectionRect.y,
 97 |             width: selectionRect.width,
 98 |             height: selectionRect.height,
 99 |             pointerEvents: "none",
100 |           }}
101 |         />
102 |       )}
103 |     </div>
104 |   );
105 | };
106 | 
107 | export default SelectionTool;
108 | 


--------------------------------------------------------------------------------
/components/side-navbar/chat-item.tsx:
--------------------------------------------------------------------------------
 1 | import Link from "next/link";
 2 | 
 3 | type ChatItemProps = {
 4 |   selected: boolean;
 5 |   id: string;
 6 |   title: string;
 7 | };
 8 | 
 9 | export const ChatItem = ({ id, title, selected }: ChatItemProps) => {
10 |   return (
11 |     <Link href={`/chat/${id}`}>
12 |       <div
13 |         className={`group cursor-pointer flex items-center gap-2 justify-between px-2 py-1 rounded-md w-full ${
14 |           selected ? "bg-slate-200" : "bg-transparent"
15 |         } hover:bg-slate-200`}
16 |       >
17 |         <span className="flex-1 truncate text-sm">{title}</span>
18 | 
19 |         {/* <Button
20 |         className="invisible group-hover:visible w-fit h-fit px-2 py-1 hover:bg-slate-200"
21 |         variant="ghost"
22 |       >
23 |         <EllipsisIcon className="w-4 h-4" />
24 |       </Button> */}
25 |       </div>
26 |     </Link>
27 |   );
28 | };
29 | 


--------------------------------------------------------------------------------
/components/side-navbar/index.tsx:
--------------------------------------------------------------------------------
  1 | "use client";
  2 | 
  3 | import { ChatItem } from "@/components/side-navbar/chat-item";
  4 | import { UserSettings } from "@/components/side-navbar/user-settings";
  5 | import { Button } from "@/components/ui/button";
  6 | import { UserButton } from "@/components/user-button";
  7 | import { getChats } from "@/lib/db";
  8 | import { useSupabase } from "@/lib/supabase";
  9 | import { useQuery } from "@tanstack/react-query";
 10 | import { Loader2Icon, SidebarIcon, SquarePenIcon } from "lucide-react";
 11 | import Image from "next/image";
 12 | import Link from "next/link";
 13 | import { useParams } from "next/navigation";
 14 | import { useState } from "react";
 15 | 
 16 | export const SideNavBar = () => {
 17 |   const [open, setOpen] = useState(false);
 18 | 
 19 |   const params = useParams();
 20 | 
 21 |   const { supabase, session } = useSupabase();
 22 |   const userId = session?.user.id;
 23 | 
 24 |   const {
 25 |     data: chats,
 26 |     error,
 27 |     isLoading,
 28 |   } = useQuery({
 29 |     queryKey: ["chats"],
 30 |     queryFn: async () => await getChats(supabase, userId),
 31 |     enabled: !!userId,
 32 |   });
 33 | 
 34 |   if (open) {
 35 |     return (
 36 |       <div className="h-screen max-h-screen overflow-hidden flex flex-col gap-4 justify-between px-2 py-2 pb-4 bg-slate-50 w-[200px]">
 37 |         <div className="flex flex-col gap-2">
 38 |           <Link href="/" className="text-lg font-semibold text-center">
 39 |             Open Artifacts
 40 |           </Link>
 41 | 
 42 |           <div className="flex items-center justify-between gap-2">
 43 |             <Button onClick={() => setOpen(false)} size="icon" variant="ghost">
 44 |               <SidebarIcon className="w-4 h-4" />
 45 |             </Button>
 46 | 
 47 |             <Link href="/new">
 48 |               <Button size="icon" variant="ghost">
 49 |                 <SquarePenIcon className="w-4 h-4" />
 50 |               </Button>
 51 |             </Link>
 52 |           </div>
 53 |         </div>
 54 | 
 55 |         <div className="flex flex-col flex-1 gap-2 overflow-hidden">
 56 |           <span className="font-medium">Chats</span>
 57 |           {chats && (
 58 |             <div className="flex flex-col flex-1 gap-2 overflow-auto">
 59 |               {chats.map((item, index) => (
 60 |                 <ChatItem
 61 |                   key={index}
 62 |                   id={item.id}
 63 |                   title={item.title}
 64 |                   selected={item.id === params.id}
 65 |                 />
 66 |               ))}
 67 |             </div>
 68 |           )}
 69 | 
 70 |           {isLoading && <Loader2Icon className="w-4 h-4 animate-spin" />}
 71 |           {error && <p className="text-red-500">Could not fetch chats</p>}
 72 |         </div>
 73 | 
 74 |         <div className="flex flex-col gap-4 mt-2">
 75 |           <a
 76 |             href="https://github.com/13point5/open-artifacts"
 77 |             target="_blank"
 78 |             className="text-black flex items-center gap-4 px-1"
 79 |           >
 80 |             <Image src="/github.svg" height="24" width="24" alt="github logo" />
 81 |             <span className="text-sm font-medium">GitHub Repo</span>
 82 |           </a>
 83 |           <UserSettings showLabel />
 84 |           <UserButton expanded />
 85 |         </div>
 86 |       </div>
 87 |     );
 88 |   }
 89 | 
 90 |   return (
 91 |     <div className="h-screen max-h-screen flex flex-col gap-2 justify-between px-2 py-2 pb-4 items-center">
 92 |       <div className="flex flex-col gap-2">
 93 |         <Link href="/" className="text-lg font-semibold text-center">
 94 |           OA
 95 |         </Link>
 96 | 
 97 |         <div className="flex items-center gap-2">
 98 |           <Button onClick={() => setOpen(true)} size="icon" variant="ghost">
 99 |             <SidebarIcon className="w-4 h-4" />
100 |           </Button>
101 | 
102 |           <Link href="/new">
103 |             <Button size="icon" variant="ghost">
104 |               <SquarePenIcon className="w-4 h-4" />
105 |             </Button>
106 |           </Link>
107 |         </div>
108 |       </div>
109 | 
110 |       <div className="flex flex-col items-center gap-4">
111 |         <a
112 |           href="https://github.com/13point5/open-artifacts"
113 |           target="_blank"
114 |           className="text-black"
115 |         >
116 |           <Image src="/github.svg" height="24" width="24" alt="github logo" />
117 |         </a>
118 |         <UserSettings />
119 |         <UserButton />
120 |       </div>
121 |     </div>
122 |   );
123 | };
124 | 


--------------------------------------------------------------------------------
/components/side-navbar/user-settings.tsx:
--------------------------------------------------------------------------------
  1 | "use client";
  2 | 
  3 | import { Button } from "@/components/ui/button";
  4 | import { SettingsIcon } from "lucide-react";
  5 | import {
  6 |   Dialog,
  7 |   DialogContent,
  8 |   DialogFooter,
  9 |   DialogHeader,
 10 |   DialogTitle,
 11 |   DialogTrigger,
 12 | } from "@/components/ui/dialog";
 13 | import { zodResolver } from "@hookform/resolvers/zod";
 14 | import { useForm } from "react-hook-form";
 15 | import {
 16 |   Form,
 17 |   FormControl,
 18 |   FormField,
 19 |   FormItem,
 20 |   FormLabel,
 21 |   FormMessage,
 22 | } from "@/components/ui/form";
 23 | import { Input } from "@/components/ui/input";
 24 | import {
 25 |   getSettings,
 26 |   SettingsSchema,
 27 |   settingsSchema,
 28 |   updateSettings,
 29 | } from "@/lib/userSettings";
 30 | import toast from "react-hot-toast";
 31 | 
 32 | type Props = {
 33 |   showLabel?: boolean;
 34 | };
 35 | 
 36 | export const UserSettings = ({ showLabel = false }: Props) => {
 37 |   const form = useForm<SettingsSchema>({
 38 |     resolver: zodResolver(settingsSchema),
 39 |     defaultValues: getSettings(),
 40 |   });
 41 | 
 42 |   function onSubmit(values: SettingsSchema) {
 43 |     updateSettings({
 44 |       ...getSettings(),
 45 |       ...values,
 46 |     });
 47 |     toast.success("Saved settings!", {
 48 |       position: "bottom-center",
 49 |     });
 50 |   }
 51 | 
 52 |   return (
 53 |     <Dialog>
 54 |       <DialogTrigger className="w-full flex items-center justify-start gap-4 px-1">
 55 |         <SettingsIcon className="w-6 h-6" />
 56 | 
 57 |         {showLabel && <span className="font-medium text-sm">Settings</span>}
 58 |       </DialogTrigger>
 59 | 
 60 |       <DialogContent>
 61 |         <Form {...form}>
 62 |           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
 63 |             <DialogHeader>
 64 |               <DialogTitle>Settings</DialogTitle>
 65 |             </DialogHeader>
 66 | 
 67 |             <FormField
 68 |               control={form.control}
 69 |               name="anthropicApiKey"
 70 |               render={({ field }) => (
 71 |                 <FormItem>
 72 |                   <FormLabel>Anthropic API Key</FormLabel>
 73 |                   <FormControl>
 74 |                     <Input {...field} type="password" />
 75 |                   </FormControl>
 76 |                   <FormMessage />
 77 |                 </FormItem>
 78 |               )}
 79 |             />
 80 | 
 81 |             <FormField
 82 |               control={form.control}
 83 |               name="openaiApiKey"
 84 |               render={({ field }) => (
 85 |                 <FormItem>
 86 |                   <FormLabel>OpenAI API Key</FormLabel>
 87 |                   <FormControl>
 88 |                     <Input {...field} type="password" />
 89 |                   </FormControl>
 90 |                   <FormMessage />
 91 |                 </FormItem>
 92 |               )}
 93 |             />
 94 | 
 95 |             <DialogFooter>
 96 |               <Button variant="outline">Cancel</Button>
 97 |               <Button type="submit">Save</Button>
 98 |             </DialogFooter>
 99 |           </form>
100 |         </Form>
101 |       </DialogContent>
102 |     </Dialog>
103 |   );
104 | };
105 | 


--------------------------------------------------------------------------------
/components/social-footer.tsx:
--------------------------------------------------------------------------------
 1 | export const SocialFooter = () => {
 2 |   return (
 3 |     <footer className="flex flex-wrap items-center gap-x-1 gap-y-2 text-sm">
 4 |       <span>Built by</span>
 5 |       <a
 6 |         href="https://www.linkedin.com/in/13point5/"
 7 |         target="_blank"
 8 |         rel="noopener noreferrer"
 9 |         className="font-bold transition hover:text-black/50 flex items-center gap-1"
10 |       >
11 |         Sriraam
12 |       </a>
13 |       <span className="hidden sm:inline">|</span>
14 |       <span>Open Sourced on</span>
15 |       <a
16 |         href="https://github.com/13point5/open-artifacts"
17 |         target="_blank"
18 |         rel="noopener noreferrer"
19 |         className="font-bold transition hover:text-black/50 flex items-center gap-1"
20 |       >
21 |         GitHub
22 |       </a>
23 |     </footer>
24 |   );
25 | };
26 | 


--------------------------------------------------------------------------------
/components/ui/alert-dialog.tsx:
--------------------------------------------------------------------------------
  1 | "use client"
  2 | 
  3 | import * as React from "react"
  4 | import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
  5 | 
  6 | import { cn } from "@/lib/utils"
  7 | import { buttonVariants } from "@/components/ui/button"
  8 | 
  9 | const AlertDialog = AlertDialogPrimitive.Root
 10 | 
 11 | const AlertDialogTrigger = AlertDialogPrimitive.Trigger
 12 | 
 13 | const AlertDialogPortal = AlertDialogPrimitive.Portal
 14 | 
 15 | const AlertDialogOverlay = React.forwardRef<
 16 |   React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
 17 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
 18 | >(({ className, ...props }, ref) => (
 19 |   <AlertDialogPrimitive.Overlay
 20 |     className={cn(
 21 |       "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
 22 |       className
 23 |     )}
 24 |     {...props}
 25 |     ref={ref}
 26 |   />
 27 | ))
 28 | AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName
 29 | 
 30 | const AlertDialogContent = React.forwardRef<
 31 |   React.ElementRef<typeof AlertDialogPrimitive.Content>,
 32 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
 33 | >(({ className, ...props }, ref) => (
 34 |   <AlertDialogPortal>
 35 |     <AlertDialogOverlay />
 36 |     <AlertDialogPrimitive.Content
 37 |       ref={ref}
 38 |       className={cn(
 39 |         "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
 40 |         className
 41 |       )}
 42 |       {...props}
 43 |     />
 44 |   </AlertDialogPortal>
 45 | ))
 46 | AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName
 47 | 
 48 | const AlertDialogHeader = ({
 49 |   className,
 50 |   ...props
 51 | }: React.HTMLAttributes<HTMLDivElement>) => (
 52 |   <div
 53 |     className={cn(
 54 |       "flex flex-col space-y-2 text-center sm:text-left",
 55 |       className
 56 |     )}
 57 |     {...props}
 58 |   />
 59 | )
 60 | AlertDialogHeader.displayName = "AlertDialogHeader"
 61 | 
 62 | const AlertDialogFooter = ({
 63 |   className,
 64 |   ...props
 65 | }: React.HTMLAttributes<HTMLDivElement>) => (
 66 |   <div
 67 |     className={cn(
 68 |       "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
 69 |       className
 70 |     )}
 71 |     {...props}
 72 |   />
 73 | )
 74 | AlertDialogFooter.displayName = "AlertDialogFooter"
 75 | 
 76 | const AlertDialogTitle = React.forwardRef<
 77 |   React.ElementRef<typeof AlertDialogPrimitive.Title>,
 78 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
 79 | >(({ className, ...props }, ref) => (
 80 |   <AlertDialogPrimitive.Title
 81 |     ref={ref}
 82 |     className={cn("text-lg font-semibold", className)}
 83 |     {...props}
 84 |   />
 85 | ))
 86 | AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName
 87 | 
 88 | const AlertDialogDescription = React.forwardRef<
 89 |   React.ElementRef<typeof AlertDialogPrimitive.Description>,
 90 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
 91 | >(({ className, ...props }, ref) => (
 92 |   <AlertDialogPrimitive.Description
 93 |     ref={ref}
 94 |     className={cn("text-sm text-muted-foreground", className)}
 95 |     {...props}
 96 |   />
 97 | ))
 98 | AlertDialogDescription.displayName =
 99 |   AlertDialogPrimitive.Description.displayName
100 | 
101 | const AlertDialogAction = React.forwardRef<
102 |   React.ElementRef<typeof AlertDialogPrimitive.Action>,
103 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
104 | >(({ className, ...props }, ref) => (
105 |   <AlertDialogPrimitive.Action
106 |     ref={ref}
107 |     className={cn(buttonVariants(), className)}
108 |     {...props}
109 |   />
110 | ))
111 | AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName
112 | 
113 | const AlertDialogCancel = React.forwardRef<
114 |   React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
115 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
116 | >(({ className, ...props }, ref) => (
117 |   <AlertDialogPrimitive.Cancel
118 |     ref={ref}
119 |     className={cn(
120 |       buttonVariants({ variant: "outline" }),
121 |       "mt-2 sm:mt-0",
122 |       className
123 |     )}
124 |     {...props}
125 |   />
126 | ))
127 | AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName
128 | 
129 | export {
130 |   AlertDialog,
131 |   AlertDialogPortal,
132 |   AlertDialogOverlay,
133 |   AlertDialogTrigger,
134 |   AlertDialogContent,
135 |   AlertDialogHeader,
136 |   AlertDialogFooter,
137 |   AlertDialogTitle,
138 |   AlertDialogDescription,
139 |   AlertDialogAction,
140 |   AlertDialogCancel,
141 | }
142 | 


--------------------------------------------------------------------------------
/components/ui/button.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | import { Slot } from "@radix-ui/react-slot";
 3 | import { cva, type VariantProps } from "class-variance-authority";
 4 | 
 5 | import { cn } from "@/lib/utils";
 6 | 
 7 | const buttonVariants = cva(
 8 |   "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
 9 |   {
10 |     variants: {
11 |       variant: {
12 |         default: "bg-primary text-primary-foreground hover:bg-primary/90",
13 |         destructive:
14 |           "bg-destructive text-destructive-foreground hover:bg-destructive/90",
15 |         outline:
16 |           "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
17 |         secondary:
18 |           "bg-secondary text-secondary-foreground hover:bg-secondary/80",
19 |         ghost: "hover:bg-accent hover:text-accent-foreground",
20 |         link: "text-primary underline-offset-4 hover:underline",
21 |       },
22 |       size: {
23 |         default: "h-10 px-4 py-2",
24 |         sm: "h-9 rounded-md px-3",
25 |         lg: "h-11 rounded-md px-8",
26 |         icon: "h-10 w-10",
27 |       },
28 |     },
29 |     defaultVariants: {
30 |       variant: "default",
31 |       size: "default",
32 |     },
33 |   }
34 | );
35 | 
36 | export interface ButtonProps
37 |   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
38 |     VariantProps<typeof buttonVariants> {
39 |   asChild?: boolean;
40 | }
41 | 
42 | const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
43 |   ({ className, variant, size, asChild = false, ...props }, ref) => {
44 |     const Comp = asChild ? Slot : "button";
45 |     return (
46 |       <Comp
47 |         className={cn(buttonVariants({ variant, size, className }))}
48 |         ref={ref}
49 |         {...props}
50 |       />
51 |     );
52 |   }
53 | );
54 | Button.displayName = "Button";
55 | 
56 | export { Button, buttonVariants };
57 | 


--------------------------------------------------------------------------------
/components/ui/card.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | 
 3 | import { cn } from "@/lib/utils"
 4 | 
 5 | const Card = React.forwardRef<
 6 |   HTMLDivElement,
 7 |   React.HTMLAttributes<HTMLDivElement>
 8 | >(({ className, ...props }, ref) => (
 9 |   <div
10 |     ref={ref}
11 |     className={cn(
12 |       "rounded-lg border bg-card text-card-foreground shadow-sm",
13 |       className
14 |     )}
15 |     {...props}
16 |   />
17 | ))
18 | Card.displayName = "Card"
19 | 
20 | const CardHeader = React.forwardRef<
21 |   HTMLDivElement,
22 |   React.HTMLAttributes<HTMLDivElement>
23 | >(({ className, ...props }, ref) => (
24 |   <div
25 |     ref={ref}
26 |     className={cn("flex flex-col space-y-1.5 p-6", className)}
27 |     {...props}
28 |   />
29 | ))
30 | CardHeader.displayName = "CardHeader"
31 | 
32 | const CardTitle = React.forwardRef<
33 |   HTMLParagraphElement,
34 |   React.HTMLAttributes<HTMLHeadingElement>
35 | >(({ className, ...props }, ref) => (
36 |   <h3
37 |     ref={ref}
38 |     className={cn(
39 |       "text-2xl font-semibold leading-none tracking-tight",
40 |       className
41 |     )}
42 |     {...props}
43 |   />
44 | ))
45 | CardTitle.displayName = "CardTitle"
46 | 
47 | const CardDescription = React.forwardRef<
48 |   HTMLParagraphElement,
49 |   React.HTMLAttributes<HTMLParagraphElement>
50 | >(({ className, ...props }, ref) => (
51 |   <p
52 |     ref={ref}
53 |     className={cn("text-sm text-muted-foreground", className)}
54 |     {...props}
55 |   />
56 | ))
57 | CardDescription.displayName = "CardDescription"
58 | 
59 | const CardContent = React.forwardRef<
60 |   HTMLDivElement,
61 |   React.HTMLAttributes<HTMLDivElement>
62 | >(({ className, ...props }, ref) => (
63 |   <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
64 | ))
65 | CardContent.displayName = "CardContent"
66 | 
67 | const CardFooter = React.forwardRef<
68 |   HTMLDivElement,
69 |   React.HTMLAttributes<HTMLDivElement>
70 | >(({ className, ...props }, ref) => (
71 |   <div
72 |     ref={ref}
73 |     className={cn("flex items-center p-6 pt-0", className)}
74 |     {...props}
75 |   />
76 | ))
77 | CardFooter.displayName = "CardFooter"
78 | 
79 | export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
80 | 


--------------------------------------------------------------------------------
/components/ui/dialog.tsx:
--------------------------------------------------------------------------------
  1 | "use client"
  2 | 
  3 | import * as React from "react"
  4 | import * as DialogPrimitive from "@radix-ui/react-dialog"
  5 | import { X } from "lucide-react"
  6 | 
  7 | import { cn } from "@/lib/utils"
  8 | 
  9 | const Dialog = DialogPrimitive.Root
 10 | 
 11 | const DialogTrigger = DialogPrimitive.Trigger
 12 | 
 13 | const DialogPortal = DialogPrimitive.Portal
 14 | 
 15 | const DialogClose = DialogPrimitive.Close
 16 | 
 17 | const DialogOverlay = React.forwardRef<
 18 |   React.ElementRef<typeof DialogPrimitive.Overlay>,
 19 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
 20 | >(({ className, ...props }, ref) => (
 21 |   <DialogPrimitive.Overlay
 22 |     ref={ref}
 23 |     className={cn(
 24 |       "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
 25 |       className
 26 |     )}
 27 |     {...props}
 28 |   />
 29 | ))
 30 | DialogOverlay.displayName = DialogPrimitive.Overlay.displayName
 31 | 
 32 | const DialogContent = React.forwardRef<
 33 |   React.ElementRef<typeof DialogPrimitive.Content>,
 34 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
 35 | >(({ className, children, ...props }, ref) => (
 36 |   <DialogPortal>
 37 |     <DialogOverlay />
 38 |     <DialogPrimitive.Content
 39 |       ref={ref}
 40 |       className={cn(
 41 |         "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
 42 |         className
 43 |       )}
 44 |       {...props}
 45 |     >
 46 |       {children}
 47 |       <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
 48 |         <X className="h-4 w-4" />
 49 |         <span className="sr-only">Close</span>
 50 |       </DialogPrimitive.Close>
 51 |     </DialogPrimitive.Content>
 52 |   </DialogPortal>
 53 | ))
 54 | DialogContent.displayName = DialogPrimitive.Content.displayName
 55 | 
 56 | const DialogHeader = ({
 57 |   className,
 58 |   ...props
 59 | }: React.HTMLAttributes<HTMLDivElement>) => (
 60 |   <div
 61 |     className={cn(
 62 |       "flex flex-col space-y-1.5 text-center sm:text-left",
 63 |       className
 64 |     )}
 65 |     {...props}
 66 |   />
 67 | )
 68 | DialogHeader.displayName = "DialogHeader"
 69 | 
 70 | const DialogFooter = ({
 71 |   className,
 72 |   ...props
 73 | }: React.HTMLAttributes<HTMLDivElement>) => (
 74 |   <div
 75 |     className={cn(
 76 |       "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
 77 |       className
 78 |     )}
 79 |     {...props}
 80 |   />
 81 | )
 82 | DialogFooter.displayName = "DialogFooter"
 83 | 
 84 | const DialogTitle = React.forwardRef<
 85 |   React.ElementRef<typeof DialogPrimitive.Title>,
 86 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
 87 | >(({ className, ...props }, ref) => (
 88 |   <DialogPrimitive.Title
 89 |     ref={ref}
 90 |     className={cn(
 91 |       "text-lg font-semibold leading-none tracking-tight",
 92 |       className
 93 |     )}
 94 |     {...props}
 95 |   />
 96 | ))
 97 | DialogTitle.displayName = DialogPrimitive.Title.displayName
 98 | 
 99 | const DialogDescription = React.forwardRef<
100 |   React.ElementRef<typeof DialogPrimitive.Description>,
101 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
102 | >(({ className, ...props }, ref) => (
103 |   <DialogPrimitive.Description
104 |     ref={ref}
105 |     className={cn("text-sm text-muted-foreground", className)}
106 |     {...props}
107 |   />
108 | ))
109 | DialogDescription.displayName = DialogPrimitive.Description.displayName
110 | 
111 | export {
112 |   Dialog,
113 |   DialogPortal,
114 |   DialogOverlay,
115 |   DialogClose,
116 |   DialogTrigger,
117 |   DialogContent,
118 |   DialogHeader,
119 |   DialogFooter,
120 |   DialogTitle,
121 |   DialogDescription,
122 | }
123 | 


--------------------------------------------------------------------------------
/components/ui/dropdown-menu.tsx:
--------------------------------------------------------------------------------
  1 | "use client"
  2 | 
  3 | import * as React from "react"
  4 | import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
  5 | import { Check, ChevronRight, Circle } from "lucide-react"
  6 | 
  7 | import { cn } from "@/lib/utils"
  8 | 
  9 | const DropdownMenu = DropdownMenuPrimitive.Root
 10 | 
 11 | const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
 12 | 
 13 | const DropdownMenuGroup = DropdownMenuPrimitive.Group
 14 | 
 15 | const DropdownMenuPortal = DropdownMenuPrimitive.Portal
 16 | 
 17 | const DropdownMenuSub = DropdownMenuPrimitive.Sub
 18 | 
 19 | const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup
 20 | 
 21 | const DropdownMenuSubTrigger = React.forwardRef<
 22 |   React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
 23 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
 24 |     inset?: boolean
 25 |   }
 26 | >(({ className, inset, children, ...props }, ref) => (
 27 |   <DropdownMenuPrimitive.SubTrigger
 28 |     ref={ref}
 29 |     className={cn(
 30 |       "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
 31 |       inset && "pl-8",
 32 |       className
 33 |     )}
 34 |     {...props}
 35 |   >
 36 |     {children}
 37 |     <ChevronRight className="ml-auto h-4 w-4" />
 38 |   </DropdownMenuPrimitive.SubTrigger>
 39 | ))
 40 | DropdownMenuSubTrigger.displayName =
 41 |   DropdownMenuPrimitive.SubTrigger.displayName
 42 | 
 43 | const DropdownMenuSubContent = React.forwardRef<
 44 |   React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
 45 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
 46 | >(({ className, ...props }, ref) => (
 47 |   <DropdownMenuPrimitive.SubContent
 48 |     ref={ref}
 49 |     className={cn(
 50 |       "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
 51 |       className
 52 |     )}
 53 |     {...props}
 54 |   />
 55 | ))
 56 | DropdownMenuSubContent.displayName =
 57 |   DropdownMenuPrimitive.SubContent.displayName
 58 | 
 59 | const DropdownMenuContent = React.forwardRef<
 60 |   React.ElementRef<typeof DropdownMenuPrimitive.Content>,
 61 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
 62 | >(({ className, sideOffset = 4, ...props }, ref) => (
 63 |   <DropdownMenuPrimitive.Portal>
 64 |     <DropdownMenuPrimitive.Content
 65 |       ref={ref}
 66 |       sideOffset={sideOffset}
 67 |       className={cn(
 68 |         "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
 69 |         className
 70 |       )}
 71 |       {...props}
 72 |     />
 73 |   </DropdownMenuPrimitive.Portal>
 74 | ))
 75 | DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName
 76 | 
 77 | const DropdownMenuItem = React.forwardRef<
 78 |   React.ElementRef<typeof DropdownMenuPrimitive.Item>,
 79 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
 80 |     inset?: boolean
 81 |   }
 82 | >(({ className, inset, ...props }, ref) => (
 83 |   <DropdownMenuPrimitive.Item
 84 |     ref={ref}
 85 |     className={cn(
 86 |       "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
 87 |       inset && "pl-8",
 88 |       className
 89 |     )}
 90 |     {...props}
 91 |   />
 92 | ))
 93 | DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName
 94 | 
 95 | const DropdownMenuCheckboxItem = React.forwardRef<
 96 |   React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
 97 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
 98 | >(({ className, children, checked, ...props }, ref) => (
 99 |   <DropdownMenuPrimitive.CheckboxItem
100 |     ref={ref}
101 |     className={cn(
102 |       "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
103 |       className
104 |     )}
105 |     checked={checked}
106 |     {...props}
107 |   >
108 |     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
109 |       <DropdownMenuPrimitive.ItemIndicator>
110 |         <Check className="h-4 w-4" />
111 |       </DropdownMenuPrimitive.ItemIndicator>
112 |     </span>
113 |     {children}
114 |   </DropdownMenuPrimitive.CheckboxItem>
115 | ))
116 | DropdownMenuCheckboxItem.displayName =
117 |   DropdownMenuPrimitive.CheckboxItem.displayName
118 | 
119 | const DropdownMenuRadioItem = React.forwardRef<
120 |   React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
121 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
122 | >(({ className, children, ...props }, ref) => (
123 |   <DropdownMenuPrimitive.RadioItem
124 |     ref={ref}
125 |     className={cn(
126 |       "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
127 |       className
128 |     )}
129 |     {...props}
130 |   >
131 |     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
132 |       <DropdownMenuPrimitive.ItemIndicator>
133 |         <Circle className="h-2 w-2 fill-current" />
134 |       </DropdownMenuPrimitive.ItemIndicator>
135 |     </span>
136 |     {children}
137 |   </DropdownMenuPrimitive.RadioItem>
138 | ))
139 | DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName
140 | 
141 | const DropdownMenuLabel = React.forwardRef<
142 |   React.ElementRef<typeof DropdownMenuPrimitive.Label>,
143 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
144 |     inset?: boolean
145 |   }
146 | >(({ className, inset, ...props }, ref) => (
147 |   <DropdownMenuPrimitive.Label
148 |     ref={ref}
149 |     className={cn(
150 |       "px-2 py-1.5 text-sm font-semibold",
151 |       inset && "pl-8",
152 |       className
153 |     )}
154 |     {...props}
155 |   />
156 | ))
157 | DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName
158 | 
159 | const DropdownMenuSeparator = React.forwardRef<
160 |   React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
161 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
162 | >(({ className, ...props }, ref) => (
163 |   <DropdownMenuPrimitive.Separator
164 |     ref={ref}
165 |     className={cn("-mx-1 my-1 h-px bg-muted", className)}
166 |     {...props}
167 |   />
168 | ))
169 | DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName
170 | 
171 | const DropdownMenuShortcut = ({
172 |   className,
173 |   ...props
174 | }: React.HTMLAttributes<HTMLSpanElement>) => {
175 |   return (
176 |     <span
177 |       className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
178 |       {...props}
179 |     />
180 |   )
181 | }
182 | DropdownMenuShortcut.displayName = "DropdownMenuShortcut"
183 | 
184 | export {
185 |   DropdownMenu,
186 |   DropdownMenuTrigger,
187 |   DropdownMenuContent,
188 |   DropdownMenuItem,
189 |   DropdownMenuCheckboxItem,
190 |   DropdownMenuRadioItem,
191 |   DropdownMenuLabel,
192 |   DropdownMenuSeparator,
193 |   DropdownMenuShortcut,
194 |   DropdownMenuGroup,
195 |   DropdownMenuPortal,
196 |   DropdownMenuSub,
197 |   DropdownMenuSubContent,
198 |   DropdownMenuSubTrigger,
199 |   DropdownMenuRadioGroup,
200 | }
201 | 


--------------------------------------------------------------------------------
/components/ui/form.tsx:
--------------------------------------------------------------------------------
  1 | "use client"
  2 | 
  3 | import * as React from "react"
  4 | import * as LabelPrimitive from "@radix-ui/react-label"
  5 | import { Slot } from "@radix-ui/react-slot"
  6 | import {
  7 |   Controller,
  8 |   ControllerProps,
  9 |   FieldPath,
 10 |   FieldValues,
 11 |   FormProvider,
 12 |   useFormContext,
 13 | } from "react-hook-form"
 14 | 
 15 | import { cn } from "@/lib/utils"
 16 | import { Label } from "@/components/ui/label"
 17 | 
 18 | const Form = FormProvider
 19 | 
 20 | type FormFieldContextValue<
 21 |   TFieldValues extends FieldValues = FieldValues,
 22 |   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
 23 | > = {
 24 |   name: TName
 25 | }
 26 | 
 27 | const FormFieldContext = React.createContext<FormFieldContextValue>(
 28 |   {} as FormFieldContextValue
 29 | )
 30 | 
 31 | const FormField = <
 32 |   TFieldValues extends FieldValues = FieldValues,
 33 |   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
 34 | >({
 35 |   ...props
 36 | }: ControllerProps<TFieldValues, TName>) => {
 37 |   return (
 38 |     <FormFieldContext.Provider value={{ name: props.name }}>
 39 |       <Controller {...props} />
 40 |     </FormFieldContext.Provider>
 41 |   )
 42 | }
 43 | 
 44 | const useFormField = () => {
 45 |   const fieldContext = React.useContext(FormFieldContext)
 46 |   const itemContext = React.useContext(FormItemContext)
 47 |   const { getFieldState, formState } = useFormContext()
 48 | 
 49 |   const fieldState = getFieldState(fieldContext.name, formState)
 50 | 
 51 |   if (!fieldContext) {
 52 |     throw new Error("useFormField should be used within <FormField>")
 53 |   }
 54 | 
 55 |   const { id } = itemContext
 56 | 
 57 |   return {
 58 |     id,
 59 |     name: fieldContext.name,
 60 |     formItemId: `${id}-form-item`,
 61 |     formDescriptionId: `${id}-form-item-description`,
 62 |     formMessageId: `${id}-form-item-message`,
 63 |     ...fieldState,
 64 |   }
 65 | }
 66 | 
 67 | type FormItemContextValue = {
 68 |   id: string
 69 | }
 70 | 
 71 | const FormItemContext = React.createContext<FormItemContextValue>(
 72 |   {} as FormItemContextValue
 73 | )
 74 | 
 75 | const FormItem = React.forwardRef<
 76 |   HTMLDivElement,
 77 |   React.HTMLAttributes<HTMLDivElement>
 78 | >(({ className, ...props }, ref) => {
 79 |   const id = React.useId()
 80 | 
 81 |   return (
 82 |     <FormItemContext.Provider value={{ id }}>
 83 |       <div ref={ref} className={cn("space-y-2", className)} {...props} />
 84 |     </FormItemContext.Provider>
 85 |   )
 86 | })
 87 | FormItem.displayName = "FormItem"
 88 | 
 89 | const FormLabel = React.forwardRef<
 90 |   React.ElementRef<typeof LabelPrimitive.Root>,
 91 |   React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
 92 | >(({ className, ...props }, ref) => {
 93 |   const { error, formItemId } = useFormField()
 94 | 
 95 |   return (
 96 |     <Label
 97 |       ref={ref}
 98 |       className={cn(error && "text-destructive", className)}
 99 |       htmlFor={formItemId}
100 |       {...props}
101 |     />
102 |   )
103 | })
104 | FormLabel.displayName = "FormLabel"
105 | 
106 | const FormControl = React.forwardRef<
107 |   React.ElementRef<typeof Slot>,
108 |   React.ComponentPropsWithoutRef<typeof Slot>
109 | >(({ ...props }, ref) => {
110 |   const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
111 | 
112 |   return (
113 |     <Slot
114 |       ref={ref}
115 |       id={formItemId}
116 |       aria-describedby={
117 |         !error
118 |           ? `${formDescriptionId}`
119 |           : `${formDescriptionId} ${formMessageId}`
120 |       }
121 |       aria-invalid={!!error}
122 |       {...props}
123 |     />
124 |   )
125 | })
126 | FormControl.displayName = "FormControl"
127 | 
128 | const FormDescription = React.forwardRef<
129 |   HTMLParagraphElement,
130 |   React.HTMLAttributes<HTMLParagraphElement>
131 | >(({ className, ...props }, ref) => {
132 |   const { formDescriptionId } = useFormField()
133 | 
134 |   return (
135 |     <p
136 |       ref={ref}
137 |       id={formDescriptionId}
138 |       className={cn("text-sm text-muted-foreground", className)}
139 |       {...props}
140 |     />
141 |   )
142 | })
143 | FormDescription.displayName = "FormDescription"
144 | 
145 | const FormMessage = React.forwardRef<
146 |   HTMLParagraphElement,
147 |   React.HTMLAttributes<HTMLParagraphElement>
148 | >(({ className, children, ...props }, ref) => {
149 |   const { error, formMessageId } = useFormField()
150 |   const body = error ? String(error?.message) : children
151 | 
152 |   if (!body) {
153 |     return null
154 |   }
155 | 
156 |   return (
157 |     <p
158 |       ref={ref}
159 |       id={formMessageId}
160 |       className={cn("text-sm font-medium text-destructive", className)}
161 |       {...props}
162 |     >
163 |       {body}
164 |     </p>
165 |   )
166 | })
167 | FormMessage.displayName = "FormMessage"
168 | 
169 | export {
170 |   useFormField,
171 |   Form,
172 |   FormItem,
173 |   FormLabel,
174 |   FormControl,
175 |   FormDescription,
176 |   FormMessage,
177 |   FormField,
178 | }
179 | 


--------------------------------------------------------------------------------
/components/ui/index.ts:
--------------------------------------------------------------------------------
 1 | export * from "./alert-dialog";
 2 | export * from "./button";
 3 | export * from "./card";
 4 | export * from "./dialog";
 5 | export * from "./dropdown-menu";
 6 | export * from "./form";
 7 | export * from "./input";
 8 | export * from "./label";
 9 | export * from "./popover";
10 | export * from "./select";
11 | export * from "./tabs";
12 | export * from "./textarea";
13 | export * from "./tooltip";
14 | 


--------------------------------------------------------------------------------
/components/ui/input.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | 
 3 | import { cn } from "@/lib/utils"
 4 | 
 5 | export interface InputProps
 6 |   extends React.InputHTMLAttributes<HTMLInputElement> {}
 7 | 
 8 | const Input = React.forwardRef<HTMLInputElement, InputProps>(
 9 |   ({ className, type, ...props }, ref) => {
10 |     return (
11 |       <input
12 |         type={type}
13 |         className={cn(
14 |           "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
15 |           className
16 |         )}
17 |         ref={ref}
18 |         {...props}
19 |       />
20 |     )
21 |   }
22 | )
23 | Input.displayName = "Input"
24 | 
25 | export { Input }
26 | 


--------------------------------------------------------------------------------
/components/ui/label.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import * as React from "react"
 4 | import * as LabelPrimitive from "@radix-ui/react-label"
 5 | import { cva, type VariantProps } from "class-variance-authority"
 6 | 
 7 | import { cn } from "@/lib/utils"
 8 | 
 9 | const labelVariants = cva(
10 |   "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
11 | )
12 | 
13 | const Label = React.forwardRef<
14 |   React.ElementRef<typeof LabelPrimitive.Root>,
15 |   React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
16 |     VariantProps<typeof labelVariants>
17 | >(({ className, ...props }, ref) => (
18 |   <LabelPrimitive.Root
19 |     ref={ref}
20 |     className={cn(labelVariants(), className)}
21 |     {...props}
22 |   />
23 | ))
24 | Label.displayName = LabelPrimitive.Root.displayName
25 | 
26 | export { Label }
27 | 


--------------------------------------------------------------------------------
/components/ui/popover.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import * as React from "react"
 4 | import * as PopoverPrimitive from "@radix-ui/react-popover"
 5 | 
 6 | import { cn } from "@/lib/utils"
 7 | 
 8 | const Popover = PopoverPrimitive.Root
 9 | 
10 | const PopoverTrigger = PopoverPrimitive.Trigger
11 | 
12 | const PopoverContent = React.forwardRef<
13 |   React.ElementRef<typeof PopoverPrimitive.Content>,
14 |   React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
15 | >(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
16 |   <PopoverPrimitive.Portal>
17 |     <PopoverPrimitive.Content
18 |       ref={ref}
19 |       align={align}
20 |       sideOffset={sideOffset}
21 |       className={cn(
22 |         "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
23 |         className
24 |       )}
25 |       {...props}
26 |     />
27 |   </PopoverPrimitive.Portal>
28 | ))
29 | PopoverContent.displayName = PopoverPrimitive.Content.displayName
30 | 
31 | export { Popover, PopoverTrigger, PopoverContent }
32 | 


--------------------------------------------------------------------------------
/components/ui/select.tsx:
--------------------------------------------------------------------------------
  1 | "use client"
  2 | 
  3 | import * as React from "react"
  4 | import * as SelectPrimitive from "@radix-ui/react-select"
  5 | import { Check, ChevronDown, ChevronUp } from "lucide-react"
  6 | 
  7 | import { cn } from "@/lib/utils"
  8 | 
  9 | const Select = SelectPrimitive.Root
 10 | 
 11 | const SelectGroup = SelectPrimitive.Group
 12 | 
 13 | const SelectValue = SelectPrimitive.Value
 14 | 
 15 | const SelectTrigger = React.forwardRef<
 16 |   React.ElementRef<typeof SelectPrimitive.Trigger>,
 17 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
 18 | >(({ className, children, ...props }, ref) => (
 19 |   <SelectPrimitive.Trigger
 20 |     ref={ref}
 21 |     className={cn(
 22 |       "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
 23 |       className
 24 |     )}
 25 |     {...props}
 26 |   >
 27 |     {children}
 28 |     <SelectPrimitive.Icon asChild>
 29 |       <ChevronDown className="h-4 w-4 opacity-50" />
 30 |     </SelectPrimitive.Icon>
 31 |   </SelectPrimitive.Trigger>
 32 | ))
 33 | SelectTrigger.displayName = SelectPrimitive.Trigger.displayName
 34 | 
 35 | const SelectScrollUpButton = React.forwardRef<
 36 |   React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
 37 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
 38 | >(({ className, ...props }, ref) => (
 39 |   <SelectPrimitive.ScrollUpButton
 40 |     ref={ref}
 41 |     className={cn(
 42 |       "flex cursor-default items-center justify-center py-1",
 43 |       className
 44 |     )}
 45 |     {...props}
 46 |   >
 47 |     <ChevronUp className="h-4 w-4" />
 48 |   </SelectPrimitive.ScrollUpButton>
 49 | ))
 50 | SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName
 51 | 
 52 | const SelectScrollDownButton = React.forwardRef<
 53 |   React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
 54 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
 55 | >(({ className, ...props }, ref) => (
 56 |   <SelectPrimitive.ScrollDownButton
 57 |     ref={ref}
 58 |     className={cn(
 59 |       "flex cursor-default items-center justify-center py-1",
 60 |       className
 61 |     )}
 62 |     {...props}
 63 |   >
 64 |     <ChevronDown className="h-4 w-4" />
 65 |   </SelectPrimitive.ScrollDownButton>
 66 | ))
 67 | SelectScrollDownButton.displayName =
 68 |   SelectPrimitive.ScrollDownButton.displayName
 69 | 
 70 | const SelectContent = React.forwardRef<
 71 |   React.ElementRef<typeof SelectPrimitive.Content>,
 72 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
 73 | >(({ className, children, position = "popper", ...props }, ref) => (
 74 |   <SelectPrimitive.Portal>
 75 |     <SelectPrimitive.Content
 76 |       ref={ref}
 77 |       className={cn(
 78 |         "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
 79 |         position === "popper" &&
 80 |           "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
 81 |         className
 82 |       )}
 83 |       position={position}
 84 |       {...props}
 85 |     >
 86 |       <SelectScrollUpButton />
 87 |       <SelectPrimitive.Viewport
 88 |         className={cn(
 89 |           "p-1",
 90 |           position === "popper" &&
 91 |             "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
 92 |         )}
 93 |       >
 94 |         {children}
 95 |       </SelectPrimitive.Viewport>
 96 |       <SelectScrollDownButton />
 97 |     </SelectPrimitive.Content>
 98 |   </SelectPrimitive.Portal>
 99 | ))
100 | SelectContent.displayName = SelectPrimitive.Content.displayName
101 | 
102 | const SelectLabel = React.forwardRef<
103 |   React.ElementRef<typeof SelectPrimitive.Label>,
104 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
105 | >(({ className, ...props }, ref) => (
106 |   <SelectPrimitive.Label
107 |     ref={ref}
108 |     className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
109 |     {...props}
110 |   />
111 | ))
112 | SelectLabel.displayName = SelectPrimitive.Label.displayName
113 | 
114 | const SelectItem = React.forwardRef<
115 |   React.ElementRef<typeof SelectPrimitive.Item>,
116 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
117 | >(({ className, children, ...props }, ref) => (
118 |   <SelectPrimitive.Item
119 |     ref={ref}
120 |     className={cn(
121 |       "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
122 |       className
123 |     )}
124 |     {...props}
125 |   >
126 |     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
127 |       <SelectPrimitive.ItemIndicator>
128 |         <Check className="h-4 w-4" />
129 |       </SelectPrimitive.ItemIndicator>
130 |     </span>
131 | 
132 |     <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
133 |   </SelectPrimitive.Item>
134 | ))
135 | SelectItem.displayName = SelectPrimitive.Item.displayName
136 | 
137 | const SelectSeparator = React.forwardRef<
138 |   React.ElementRef<typeof SelectPrimitive.Separator>,
139 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
140 | >(({ className, ...props }, ref) => (
141 |   <SelectPrimitive.Separator
142 |     ref={ref}
143 |     className={cn("-mx-1 my-1 h-px bg-muted", className)}
144 |     {...props}
145 |   />
146 | ))
147 | SelectSeparator.displayName = SelectPrimitive.Separator.displayName
148 | 
149 | export {
150 |   Select,
151 |   SelectGroup,
152 |   SelectValue,
153 |   SelectTrigger,
154 |   SelectContent,
155 |   SelectLabel,
156 |   SelectItem,
157 |   SelectSeparator,
158 |   SelectScrollUpButton,
159 |   SelectScrollDownButton,
160 | }
161 | 


--------------------------------------------------------------------------------
/components/ui/separator.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import * as React from "react"
 4 | import * as SeparatorPrimitive from "@radix-ui/react-separator"
 5 | 
 6 | import { cn } from "@/lib/utils"
 7 | 
 8 | const Separator = React.forwardRef<
 9 |   React.ElementRef<typeof SeparatorPrimitive.Root>,
10 |   React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
11 | >(
12 |   (
13 |     { className, orientation = "horizontal", decorative = true, ...props },
14 |     ref
15 |   ) => (
16 |     <SeparatorPrimitive.Root
17 |       ref={ref}
18 |       decorative={decorative}
19 |       orientation={orientation}
20 |       className={cn(
21 |         "shrink-0 bg-border",
22 |         orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
23 |         className
24 |       )}
25 |       {...props}
26 |     />
27 |   )
28 | )
29 | Separator.displayName = SeparatorPrimitive.Root.displayName
30 | 
31 | export { Separator }
32 | 


--------------------------------------------------------------------------------
/components/ui/tabs.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import * as React from "react"
 4 | import * as TabsPrimitive from "@radix-ui/react-tabs"
 5 | 
 6 | import { cn } from "@/lib/utils"
 7 | 
 8 | const Tabs = TabsPrimitive.Root
 9 | 
10 | const TabsList = React.forwardRef<
11 |   React.ElementRef<typeof TabsPrimitive.List>,
12 |   React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
13 | >(({ className, ...props }, ref) => (
14 |   <TabsPrimitive.List
15 |     ref={ref}
16 |     className={cn(
17 |       "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
18 |       className
19 |     )}
20 |     {...props}
21 |   />
22 | ))
23 | TabsList.displayName = TabsPrimitive.List.displayName
24 | 
25 | const TabsTrigger = React.forwardRef<
26 |   React.ElementRef<typeof TabsPrimitive.Trigger>,
27 |   React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
28 | >(({ className, ...props }, ref) => (
29 |   <TabsPrimitive.Trigger
30 |     ref={ref}
31 |     className={cn(
32 |       "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
33 |       className
34 |     )}
35 |     {...props}
36 |   />
37 | ))
38 | TabsTrigger.displayName = TabsPrimitive.Trigger.displayName
39 | 
40 | const TabsContent = React.forwardRef<
41 |   React.ElementRef<typeof TabsPrimitive.Content>,
42 |   React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
43 | >(({ className, ...props }, ref) => (
44 |   <TabsPrimitive.Content
45 |     ref={ref}
46 |     className={cn(
47 |       "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
48 |       className
49 |     )}
50 |     {...props}
51 |   />
52 | ))
53 | TabsContent.displayName = TabsPrimitive.Content.displayName
54 | 
55 | export { Tabs, TabsList, TabsTrigger, TabsContent }
56 | 


--------------------------------------------------------------------------------
/components/ui/textarea.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | 
 3 | import { cn } from "@/lib/utils"
 4 | 
 5 | export interface TextareaProps
 6 |   extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
 7 | 
 8 | const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
 9 |   ({ className, ...props }, ref) => {
10 |     return (
11 |       <textarea
12 |         className={cn(
13 |           "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
14 |           className
15 |         )}
16 |         ref={ref}
17 |         {...props}
18 |       />
19 |     )
20 |   }
21 | )
22 | Textarea.displayName = "Textarea"
23 | 
24 | export { Textarea }
25 | 


--------------------------------------------------------------------------------
/components/ui/tooltip.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import * as React from "react"
 4 | import * as TooltipPrimitive from "@radix-ui/react-tooltip"
 5 | 
 6 | import { cn } from "@/lib/utils"
 7 | 
 8 | const TooltipProvider = TooltipPrimitive.Provider
 9 | 
10 | const Tooltip = TooltipPrimitive.Root
11 | 
12 | const TooltipTrigger = TooltipPrimitive.Trigger
13 | 
14 | const TooltipContent = React.forwardRef<
15 |   React.ElementRef<typeof TooltipPrimitive.Content>,
16 |   React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
17 | >(({ className, sideOffset = 4, ...props }, ref) => (
18 |   <TooltipPrimitive.Content
19 |     ref={ref}
20 |     sideOffset={sideOffset}
21 |     className={cn(
22 |       "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
23 |       className
24 |     )}
25 |     {...props}
26 |   />
27 | ))
28 | TooltipContent.displayName = TooltipPrimitive.Content.displayName
29 | 
30 | export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
31 | 


--------------------------------------------------------------------------------
/components/user-button/index.tsx:
--------------------------------------------------------------------------------
 1 | "use client";
 2 | 
 3 | import {
 4 |   DropdownMenu,
 5 |   DropdownMenuContent,
 6 |   DropdownMenuItem,
 7 |   DropdownMenuLabel,
 8 |   DropdownMenuSeparator,
 9 |   DropdownMenuTrigger,
10 | } from "@/components/ui/dropdown-menu";
11 | import { SignOutDialog } from "./sign-out-dialog";
12 | import { UserIcon } from "lucide-react";
13 | import { useRouter } from "next/navigation";
14 | import { useState } from "react";
15 | import { useSupabase } from "@/lib/supabase";
16 | 
17 | type Props = {
18 |   expanded?: boolean;
19 | };
20 | 
21 | export const UserButton = ({ expanded = false }: Props) => {
22 |   const router = useRouter();
23 | 
24 |   const { supabase } = useSupabase();
25 | 
26 |   const [isSignoutDialogOpen, setIsSignoutDialogOpen] = useState(false);
27 | 
28 |   const handleOpenSignoutDialog = () => setIsSignoutDialogOpen(true);
29 |   const handleCloseSignoutDialog = () => setIsSignoutDialogOpen(false);
30 | 
31 |   const handleSignOut: React.MouseEventHandler<HTMLButtonElement> = async (
32 |     e
33 |   ) => {
34 |     e.preventDefault();
35 | 
36 |     try {
37 |       const res = await supabase.auth.signOut();
38 | 
39 |       if (res.error) throw new Error(res.error.message);
40 | 
41 |       router.refresh();
42 |     } catch (error) {
43 |       console.error(error);
44 |       alert("Error signing out");
45 |     } finally {
46 |       handleCloseSignoutDialog();
47 |     }
48 |   };
49 | 
50 |   return (
51 |     <>
52 |       <DropdownMenu>
53 |         <DropdownMenuTrigger className="w-full flex items-center justify-start gap-4 px-1 h-6">
54 |           <UserIcon size={24} />
55 | 
56 |           {expanded && (
57 |             <span className="font-medium text-sm truncate">My Account</span>
58 |           )}
59 |         </DropdownMenuTrigger>
60 | 
61 |         <DropdownMenuContent className="w-56" align="end" forceMount>
62 |           <DropdownMenuLabel>My Account</DropdownMenuLabel>
63 | 
64 |           <DropdownMenuSeparator />
65 | 
66 |           <DropdownMenuItem
67 |             onClick={handleOpenSignoutDialog}
68 |             className="cursor-pointer"
69 |           >
70 |             Sign Out
71 |           </DropdownMenuItem>
72 |         </DropdownMenuContent>
73 |       </DropdownMenu>
74 | 
75 |       <SignOutDialog
76 |         open={isSignoutDialogOpen}
77 |         onOpenChange={setIsSignoutDialogOpen}
78 |         handleSignOut={handleSignOut}
79 |       />
80 |     </>
81 |   );
82 | };
83 | 


--------------------------------------------------------------------------------
/components/user-button/sign-out-dialog.tsx:
--------------------------------------------------------------------------------
 1 | import {
 2 |   AlertDialog,
 3 |   AlertDialogAction,
 4 |   AlertDialogCancel,
 5 |   AlertDialogContent,
 6 |   AlertDialogDescription,
 7 |   AlertDialogFooter,
 8 |   AlertDialogHeader,
 9 |   AlertDialogTitle,
10 |   AlertDialogTrigger,
11 | } from "@/components/ui/alert-dialog";
12 | 
13 | type Props = {
14 |   open: boolean;
15 |   onOpenChange: (open: boolean) => void;
16 |   handleSignOut: React.MouseEventHandler<HTMLButtonElement>;
17 | };
18 | 
19 | export const SignOutDialog = ({ open, onOpenChange, handleSignOut }: Props) => {
20 |   return (
21 |     <AlertDialog open={open} onOpenChange={onOpenChange}>
22 |       <AlertDialogContent>
23 |         <AlertDialogHeader>
24 |           <AlertDialogTitle>Sign Out</AlertDialogTitle>
25 |           <AlertDialogDescription>
26 |             Are you sure you want to sign out?
27 |           </AlertDialogDescription>
28 |         </AlertDialogHeader>
29 |         <AlertDialogFooter>
30 |           <AlertDialogCancel>Cancel</AlertDialogCancel>
31 |           <AlertDialogAction onClick={handleSignOut}>
32 |             Sign Out
33 |           </AlertDialogAction>
34 |         </AlertDialogFooter>
35 |       </AlertDialogContent>
36 |     </AlertDialog>
37 |   );
38 | };
39 | 


--------------------------------------------------------------------------------
/lib/db.ts:
--------------------------------------------------------------------------------
 1 | import { Attachment } from "@/app/types";
 2 | import { SupabaseContextType } from "@/lib/supabase/types";
 3 | 
 4 | export const getChats = async (
 5 |   supabase: SupabaseContextType["supabase"],
 6 |   userId: string | null | undefined
 7 | ) => {
 8 |   if (!userId) throw new Error("User not authenticated");
 9 | 
10 |   const { data, error } = await supabase
11 |     .from("chats")
12 |     .select("*")
13 |     .eq("user_id", userId)
14 |     .order("created_at", { ascending: false });
15 | 
16 |   if (error) {
17 |     console.error(error);
18 |     throw new Error(error.message);
19 |   }
20 | 
21 |   return data;
22 | };
23 | 
24 | export const getChatMessages = async (
25 |   supabase: SupabaseContextType["supabase"],
26 |   id: string | null
27 | ) => {
28 |   if (!id) return [];
29 | 
30 |   const { data, error } = await supabase
31 |     .from("messages")
32 |     .select("*")
33 |     .eq("chat_id", id)
34 |     .order("created_at");
35 | 
36 |   if (error) {
37 |     console.error(error);
38 |     throw new Error(error.message);
39 |   }
40 | 
41 |   return data;
42 | };
43 | 
44 | export const createChat = async (
45 |   supabase: SupabaseContextType["supabase"],
46 |   title: string,
47 |   userId: string | null | undefined
48 | ) => {
49 |   if (!userId) {
50 |     throw new Error("User not authenticated");
51 |   }
52 | 
53 |   const { data, error } = await supabase
54 |     .from("chats")
55 |     .insert({
56 |       title,
57 |       user_id: userId,
58 |     })
59 |     .select();
60 | 
61 |   if (error) {
62 |     console.error(error);
63 |     throw new Error(error.message);
64 |   }
65 | 
66 |   if (!data || data.length === 0) {
67 |     throw new Error("Could not create chat");
68 |   }
69 | 
70 |   return data[0];
71 | };
72 | 
73 | export const addMessage = async (
74 |   supabase: SupabaseContextType["supabase"],
75 |   chatId: string | null,
76 |   message: { role: string; content: string; metadata?: Record<string, any> },
77 |   attachments: Attachment[] = []
78 | ) => {
79 |   if (!chatId) return message;
80 | 
81 |   const { error } = await supabase.from("messages").insert({
82 |     chat_id: chatId,
83 |     role: message.role,
84 |     text: message.content,
85 |     attachments,
86 |   });
87 | 
88 |   if (error) {
89 |     console.error(error);
90 |     throw new Error(error.message);
91 |   }
92 | 
93 |   return message;
94 | };
95 | 


--------------------------------------------------------------------------------
/lib/hooks/use-copy-to-clipboard.ts:
--------------------------------------------------------------------------------
 1 | "use client";
 2 | 
 3 | import { useState } from "react";
 4 | 
 5 | export interface useCopyToClipboardProps {
 6 |   timeout?: number;
 7 | }
 8 | 
 9 | export function useCopyToClipboard({
10 |   timeout = 2000,
11 | }: useCopyToClipboardProps) {
12 |   const [isCopied, setIsCopied] = useState<Boolean>(false);
13 | 
14 |   const copyToClipboard = (value: string) => {
15 |     if (typeof window === "undefined" || !navigator.clipboard?.writeText) {
16 |       return;
17 |     }
18 | 
19 |     if (!value) {
20 |       return;
21 |     }
22 | 
23 |     navigator.clipboard.writeText(value).then(() => {
24 |       setIsCopied(true);
25 | 
26 |       setTimeout(() => {
27 |         setIsCopied(false);
28 |       }, timeout);
29 |     });
30 |   };
31 | 
32 |   return { isCopied, copyToClipboard };
33 | }
34 | 


--------------------------------------------------------------------------------
/lib/hooks/use-enter-submit.ts:
--------------------------------------------------------------------------------
 1 | export const useEnterSubmit = ({
 2 |   onSubmit,
 3 | }: {
 4 |   onSubmit: () => void;
 5 | }): {
 6 |   onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
 7 | } => {
 8 |   const handleKeyDown = (
 9 |     event: React.KeyboardEvent<HTMLTextAreaElement>
10 |   ): void => {
11 |     if (
12 |       event.key === "Enter" &&
13 |       !event.shiftKey &&
14 |       !event.nativeEvent.isComposing
15 |     ) {
16 |       event.preventDefault();
17 |       onSubmit();
18 |     }
19 |   };
20 | 
21 |   return { onKeyDown: handleKeyDown };
22 | };
23 | 


--------------------------------------------------------------------------------
/lib/hooks/use-fake-whisper.ts:
--------------------------------------------------------------------------------
 1 | import { useWhisper as useRealWhisper } from "@chengsokdara/use-whisper";
 2 | import { useState } from "react";
 3 | 
 4 | type WhisperResult = ReturnType<typeof useRealWhisper>;
 5 | 
 6 | export const useFakeWhisper = (): WhisperResult => {
 7 |   const [recording, setRecording] = useState(false);
 8 | 
 9 |   return {
10 |     recording,
11 |     speaking: false,
12 |     transcribing: false,
13 |     transcript: { text: "", blob: undefined },
14 |     pauseRecording: () => new Promise((resolve) => resolve()),
15 |     startRecording: () =>
16 |       new Promise<void>((resolve) => {
17 |         setRecording(true);
18 |         resolve();
19 |       }),
20 |     stopRecording: () =>
21 |       new Promise<void>((resolve) => {
22 |         setRecording(false);
23 |         resolve();
24 |       }),
25 |   };
26 | };
27 | 


--------------------------------------------------------------------------------
/lib/hooks/use-scroll-anchor.ts:
--------------------------------------------------------------------------------
 1 | import { Message } from "ai/react";
 2 | import { useCallback, useEffect, useRef, useState } from "react";
 3 | 
 4 | export const useScrollAnchor = (messages: Message[]) => {
 5 |   const messagesRef = useRef<HTMLDivElement>(null);
 6 |   const scrollRef = useRef<HTMLDivElement>(null);
 7 |   const [isAtBottom, setIsAtBottom] = useState(true);
 8 |   const [showScrollButton, setShowScrollButton] = useState(false);
 9 |   const [autoScroll, setAutoScroll] = useState(true);
10 |   const lastMessageRef = useRef<Message | null>(null);
11 | 
12 |   const scrollToBottom = useCallback(() => {
13 |     if (scrollRef.current) {
14 |       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
15 |     }
16 |   }, []);
17 | 
18 |   useEffect(() => {
19 |     if (messages.length > 0) {
20 |       const lastMessage = messages[messages.length - 1];
21 |       if (lastMessage !== lastMessageRef.current) {
22 |         // New message added
23 |         lastMessageRef.current = lastMessage;
24 |         if (isAtBottom) {
25 |           scrollToBottom();
26 |         } else {
27 |           setShowScrollButton(true);
28 |         }
29 |       } else if (autoScroll) {
30 |         // Existing message updated
31 |         scrollToBottom();
32 |       }
33 |     }
34 |   }, [messages, isAtBottom, autoScroll, scrollToBottom]);
35 | 
36 |   useEffect(() => {
37 |     const handleScroll = () => {
38 |       if (scrollRef.current) {
39 |         const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
40 |         const bottomThreshold = 20;
41 |         const newIsAtBottom =
42 |           scrollTop + clientHeight >= scrollHeight - bottomThreshold;
43 | 
44 |         setIsAtBottom(newIsAtBottom);
45 |         setShowScrollButton(!newIsAtBottom);
46 |         setAutoScroll(newIsAtBottom);
47 |       }
48 |     };
49 | 
50 |     const current = scrollRef.current;
51 |     if (current) {
52 |       current.addEventListener("scroll", handleScroll, { passive: true });
53 |       return () => current.removeEventListener("scroll", handleScroll);
54 |     }
55 |   }, []);
56 | 
57 |   const handleNewMessage = useCallback(() => {
58 |     if (isAtBottom) {
59 |       scrollToBottom();
60 |     } else {
61 |       setShowScrollButton(true);
62 |     }
63 |     setAutoScroll(true);
64 |   }, [isAtBottom, scrollToBottom]);
65 | 
66 |   const handleManualScroll = () => {
67 |     scrollToBottom();
68 |     setAutoScroll(true);
69 |     setShowScrollButton(false);
70 |   };
71 | 
72 |   return {
73 |     messagesRef,
74 |     scrollRef,
75 |     scrollToBottom,
76 |     isAtBottom,
77 |     showScrollButton,
78 |     handleNewMessage,
79 |     handleManualScroll,
80 |   };
81 | };
82 | 


--------------------------------------------------------------------------------
/lib/sampleMessages.ts:
--------------------------------------------------------------------------------
  1 | import { Message } from "ai";
  2 | 
  3 | export const sampleMessages: Message[] = [
  4 |   {
  5 |     id: "1",
  6 |     role: "user",
  7 |     content: "hello",
  8 |   },
  9 |   {
 10 |     id: "2",
 11 |     role: "assistant",
 12 |     content: `
 13 | Certainly! I'll create an interactive React component to teach linear equations. This component will allow users to adjust the slope and y-intercept of a linear equation and see the resulting line on a graph in real-time.
 14 | 
 15 | <antthinking>Creating an interactive React component to teach linear equations is an excellent candidate for an artifact. It's substantial, self-contained, and can be reused in various educational contexts. This is a new request, so I'll create a new artifact with the identifier "linear-equation-interactive".</antthinking>
 16 | 
 17 | <antartifact identifier="linear-equation-interactive" type="application/vnd.ant.react" title="Interactive Linear Equation Component">
 18 | import React, { useState } from 'react';
 19 | import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
 20 | import { Slider } from '@/components/ui/slider';
 21 | import { Card, CardHeader, CardContent } from '@/components/ui/card';
 22 | 
 23 | const LinearEquationInteractive = () => {
 24 |   const [slope, setSlope] = useState(1);
 25 |   const [yIntercept, setYIntercept] = useState(0);
 26 | 
 27 |   const generateData = () => {
 28 |     return Array.from({ length: 11 }, (_, i) => {
 29 |       const x = i - 5;
 30 |       const y = slope * x + yIntercept;
 31 |       return { x, y };
 32 |     });
 33 |   };
 34 | 
 35 |   return (
 36 |     <Card className="w-full max-w-3xl mx-auto">
 37 |       <CardHeader>
 38 |         <h2 className="text-2xl font-bold">Interactive Linear Equation</h2>
 39 |         <p className="text-gray-600">y = mx + b</p>
 40 |       </CardHeader>
 41 |       <CardContent>
 42 |         <div className="mb-6">
 43 |           <div className="mb-4">
 44 |             <label className="block text-sm font-medium text-gray-700 mb-1">
 45 |               Slope (m): {slope.toFixed(2)}
 46 |             </label>
 47 |             <Slider
 48 |               value={[slope]}
 49 |               onValueChange={(value) => setSlope(value[0])}
 50 |               min={-5}
 51 |               max={5}
 52 |               step={0.1}
 53 |             />
 54 |           </div>
 55 |           <div className="mb-4">
 56 |             <label className="block text-sm font-medium text-gray-700 mb-1">
 57 |               Y-intercept (b): {yIntercept.toFixed(2)}
 58 |             </label>
 59 |             <Slider
 60 |               value={[yIntercept]}
 61 |               onValueChange={(value) => setYIntercept(value[0])}
 62 |               min={-5}
 63 |               max={5}
 64 |               step={0.1}
 65 |             />
 66 |           </div>
 67 |         </div>
 68 |         <div className="text-center mb-4">
 69 |           <p className="text-lg font-semibold">
 70 |             Equation: y = {slope.toFixed(2)}x + {yIntercept.toFixed(2)}
 71 |           </p>
 72 |         </div>
 73 |         <ResponsiveContainer width="100%" height={300}>
 74 |           <LineChart data={generateData()} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
 75 |             <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth={2} />
 76 |             <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
 77 |             <XAxis
 78 |               dataKey="x"
 79 |               domain={[-5, 5]}
 80 |               type="number"
 81 |               ticks={[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]}
 82 |             />
 83 |             <YAxis domain={[-10, 10]} />
 84 |           </LineChart>
 85 |         </ResponsiveContainer>
 86 |       </CardContent>
 87 |     </Card>
 88 |   );
 89 | };
 90 | 
 91 | export default LinearEquationInteractive;
 92 | </antartifact>
 93 | 
 94 | This interactive component allows users to explore linear equations by adjusting the slope and y-intercept. Here's a breakdown of its features:
 95 | 
 96 | 1. Two sliders allow users to change the slope (m) and y-intercept (b) of the equation.
 97 | 2. The current equation is displayed above the graph, updating in real-time as the sliders are adjusted.
 98 | 3. A line chart shows the resulting line based on the current equation.
 99 | 4. The x-axis ranges from -5 to 5, and the y-axis adjusts automatically to show the line.
100 | 
101 | This component helps students visualize how changes in slope and y-intercept affect the line's position and steepness. Users can experiment with different values to see how the line changes, reinforcing their understanding of linear equations.
102 | 
103 | To use this component, you would import it into a React application and render it like this:
104 | 
105 | \`\`\`jsx
106 | import LinearEquationInteractive from './LinearEquationInteractive';
107 | 
108 | function App() {
109 |   return (
110 |     <div className="App">
111 |       <LinearEquationInteractive />
112 |     </div>
113 |   );
114 | }
115 | \`\`\`
116 | 
117 | Would you like me to explain any part of the code in more detail or suggest ways to extend this interactive component?
118 |     `,
119 |   },
120 | ];
121 | 


--------------------------------------------------------------------------------
/lib/supabase/hooks/useSupabase.ts:
--------------------------------------------------------------------------------
 1 | "use client";
 2 | 
 3 | import { useContext } from "react";
 4 | 
 5 | import { SupabaseContext } from "../supabase-provider";
 6 | import { SupabaseContextType } from "../types";
 7 | 
 8 | export const useSupabase = (): SupabaseContextType => {
 9 |   const context = useContext(SupabaseContext);
10 | 
11 |   if (context === undefined) {
12 |     throw new Error("useSupabase must be used inside SupabaseProvider");
13 |   }
14 | 
15 |   return context;
16 | };
17 | 


--------------------------------------------------------------------------------
/lib/supabase/index.ts:
--------------------------------------------------------------------------------
1 | export * from "./hooks/useSupabase";
2 | export * from "./supabase-provider";
3 | 


--------------------------------------------------------------------------------
/lib/supabase/supabase-provider.tsx:
--------------------------------------------------------------------------------
 1 | "use client";
 2 | 
 3 | import {
 4 |   createClientComponentClient,
 5 |   Session,
 6 | } from "@supabase/auth-helpers-nextjs";
 7 | import { useRouter } from "next/navigation";
 8 | import { createContext, useEffect, useState } from "react";
 9 | 
10 | import { SupabaseContextType } from "./types";
11 | 
12 | export const SupabaseContext = createContext<SupabaseContextType | undefined>(
13 |   undefined
14 | );
15 | 
16 | export const SupabaseProvider = ({
17 |   children,
18 |   session,
19 | }: {
20 |   children: React.ReactNode;
21 |   session: Session | null;
22 | }): JSX.Element => {
23 |   const [supabase] = useState(() => createClientComponentClient());
24 |   const router = useRouter();
25 | 
26 |   useEffect(() => {
27 |     const {
28 |       data: { subscription },
29 |     } = supabase.auth.onAuthStateChange(() => {
30 |       router.refresh();
31 |     });
32 | 
33 |     return () => {
34 |       subscription.unsubscribe();
35 |     };
36 |   }, [router, supabase]);
37 | 
38 |   return (
39 |     <SupabaseContext.Provider value={{ supabase, session }}>
40 |       <>{children}</>
41 |     </SupabaseContext.Provider>
42 |   );
43 | };
44 | 


--------------------------------------------------------------------------------
/lib/supabase/types.ts:
--------------------------------------------------------------------------------
1 | import { Database } from "@/app/supabase.types";
2 | import { Session, SupabaseClient } from "@supabase/auth-helpers-nextjs";
3 | 
4 | export type SupabaseContextType = {
5 |   supabase: SupabaseClient<Database>;
6 |   session: Session | null;
7 | };
8 | 


--------------------------------------------------------------------------------
/lib/userSettings.ts:
--------------------------------------------------------------------------------
 1 | import { Models } from "@/app/types";
 2 | import { z } from "zod";
 3 | 
 4 | export const settingsLocalStorageKey = "openArtifacts:settings";
 5 | 
 6 | export const settingsSchema = z.object({
 7 |   anthropicApiKey: z.string(),
 8 |   openaiApiKey: z.string(),
 9 |   model: z.nativeEnum(Models),
10 | });
11 | 
12 | export type SettingsSchema = z.infer<typeof settingsSchema>;
13 | 
14 | const defaultSettings: SettingsSchema = {
15 |   anthropicApiKey: "",
16 |   openaiApiKey: "",
17 |   model: Models.claude,
18 | };
19 | 
20 | export const getSettings = (): SettingsSchema => {
21 |   const storedSettings = window.localStorage.getItem(settingsLocalStorageKey);
22 | 
23 |   if (!storedSettings) {
24 |     return defaultSettings;
25 |   }
26 | 
27 |   try {
28 |     const parsedSettings = JSON.parse(storedSettings);
29 | 
30 |     // Merge stored settings with default settings to ensure all fields are present
31 |     const mergedSettings: SettingsSchema = {
32 |       ...defaultSettings,
33 |       ...parsedSettings,
34 |     };
35 | 
36 |     // Ensure the model field is a valid enum value if it exists
37 |     if (
38 |       mergedSettings.model !== null &&
39 |       !Object.values(Models).includes(mergedSettings.model)
40 |     ) {
41 |       console.warn(
42 |         `Invalid model value: ${mergedSettings.model}. Resetting to null.`
43 |       );
44 |       mergedSettings.model = Models.claude;
45 |     }
46 | 
47 |     // Validate and parse the merged settings
48 |     return settingsSchema.parse(mergedSettings);
49 |   } catch (error) {
50 |     console.error("Error parsing stored settings:", error);
51 |     return defaultSettings;
52 |   }
53 | };
54 | 
55 | export const updateSettings = (newSettings: SettingsSchema) =>
56 |   window.localStorage.setItem(
57 |     settingsLocalStorageKey,
58 |     JSON.stringify(newSettings)
59 |   );
60 | 


--------------------------------------------------------------------------------
/lib/utils.ts:
--------------------------------------------------------------------------------
  1 | import { type ClassValue, clsx } from "clsx";
  2 | import { twMerge } from "tailwind-merge";
  3 | 
  4 | export const convertFileToBase64 = (file: File): Promise<string> => {
  5 |   return new Promise((resolve, reject) => {
  6 |     const reader = new FileReader();
  7 |     reader.readAsDataURL(file);
  8 |     reader.onload = () => resolve(reader.result as string);
  9 |     reader.onerror = (error) => reject(error);
 10 |   });
 11 | };
 12 | 
 13 | export function cn(...inputs: ClassValue[]) {
 14 |   return twMerge(clsx(inputs));
 15 | }
 16 | 
 17 | export type ArtifactMessagePartData = {
 18 |   generating: boolean;
 19 |   id: string | null;
 20 |   type: string | null;
 21 |   title: string | null;
 22 |   content: string;
 23 |   language: string | null;
 24 | };
 25 | 
 26 | export type MessagePart =
 27 |   | {
 28 |       type: "text";
 29 |       data: string;
 30 |     }
 31 |   | {
 32 |       type: "artifact";
 33 |       data: ArtifactMessagePartData;
 34 |     }
 35 |   | {
 36 |       type: "thought";
 37 |       data: string | null;
 38 |     };
 39 | 
 40 | export function parseMessage(message: string): MessagePart[] {
 41 |   const parts: MessagePart[] = [];
 42 |   let currentPart: MessagePart | null = null;
 43 |   let buffer = "";
 44 |   let i = 0;
 45 | 
 46 |   while (i < message.length) {
 47 |     const char = message[i];
 48 | 
 49 |     if (char === "<" && !currentPart) {
 50 |       if (buffer.trim()) {
 51 |         parts.push({ type: "text", data: buffer.trim() });
 52 |         buffer = "";
 53 |       }
 54 | 
 55 |       const tagEnd = message.indexOf(">", i);
 56 |       if (tagEnd === -1) {
 57 |         buffer += char;
 58 |         i++;
 59 |         continue;
 60 |       }
 61 | 
 62 |       const tag = message.slice(i + 1, tagEnd);
 63 |       if (tag.startsWith("thinking")) {
 64 |         currentPart = { type: "thought", data: "" };
 65 |         i = tagEnd + 1;
 66 |       } else if (tag.startsWith("artifact")) {
 67 |         const data: ArtifactMessagePartData = {
 68 |           generating: true,
 69 |           id: null,
 70 |           type: null,
 71 |           title: null,
 72 |           content: "",
 73 |           language: null,
 74 |         };
 75 |         const attributeRegex = /(\w+)="([^"]*)"/g;
 76 |         let match;
 77 |         while ((match = attributeRegex.exec(tag)) !== null) {
 78 |           const [, key, value] = match;
 79 |           if (key === "identifier") data.id = value;
 80 |           else if (key === "type") data.type = value;
 81 |           else if (key === "title") data.title = value;
 82 |           else if (key === "language") data.language = value;
 83 |         }
 84 |         currentPart = { type: "artifact", data };
 85 |         i = tagEnd + 1;
 86 |       } else {
 87 |         buffer += char;
 88 |         i++;
 89 |       }
 90 |     } else if (currentPart) {
 91 |       const closingTag =
 92 |         currentPart.type === "thought" ? "</thinking>" : "</artifact>";
 93 |       const closingIndex = message.indexOf(closingTag, i);
 94 | 
 95 |       if (closingIndex !== -1) {
 96 |         const content = message.slice(i, closingIndex);
 97 |         if (currentPart.type === "thought") {
 98 |           currentPart.data = content;
 99 |         } else if (currentPart.type === "artifact" && currentPart.data) {
100 |           currentPart.data.content = content;
101 |           currentPart.data.generating = false;
102 |         }
103 |         parts.push(currentPart);
104 |         currentPart = null;
105 |         i = closingIndex + closingTag.length;
106 |       } else {
107 |         // If no closing tag is found, treat the rest of the message as content
108 |         const remainingContent = message.slice(i);
109 |         if (currentPart.type === "thought") {
110 |           currentPart.data = remainingContent;
111 |         } else if (currentPart.type === "artifact" && currentPart.data) {
112 |           currentPart.data.content = remainingContent;
113 |         }
114 |         parts.push(currentPart);
115 |         break;
116 |       }
117 |     } else {
118 |       buffer += char;
119 |       i++;
120 |     }
121 |   }
122 | 
123 |   if (buffer.trim()) {
124 |     parts.push({ type: "text", data: buffer.trim() });
125 |   }
126 | 
127 |   return combineTextParts(parts);
128 | }
129 | 
130 | function combineTextParts(parts: MessagePart[]): MessagePart[] {
131 |   const combinedParts: MessagePart[] = [];
132 |   let currentTextContent = "";
133 | 
134 |   for (const part of parts) {
135 |     if (part.type === "text") {
136 |       currentTextContent += (currentTextContent ? " " : "") + part.data;
137 |     } else {
138 |       if (currentTextContent) {
139 |         combinedParts.push({ type: "text", data: currentTextContent });
140 |         currentTextContent = "";
141 |       }
142 |       combinedParts.push(part);
143 |     }
144 |   }
145 | 
146 |   if (currentTextContent) {
147 |     combinedParts.push({ type: "text", data: currentTextContent });
148 |   }
149 | 
150 |   return combinedParts;
151 | }
152 | 


--------------------------------------------------------------------------------
/next.config.mjs:
--------------------------------------------------------------------------------
1 | /** @type {import('next').NextConfig} */
2 | const nextConfig = {};
3 | 
4 | export default nextConfig;
5 | 


--------------------------------------------------------------------------------
/package.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "name": "open-artifacts",
 3 |   "version": "0.1.0",
 4 |   "private": true,
 5 |   "scripts": {
 6 |     "dev": "next dev",
 7 |     "build": "next build",
 8 |     "start": "next start",
 9 |     "lint": "next lint"
10 |   },
11 |   "dependencies": {
12 |     "@ai-sdk/anthropic": "^0.0.31",
13 |     "@ai-sdk/openai": "^0.0.38",
14 |     "@chengsokdara/use-whisper": "^0.2.0",
15 |     "@ffmpeg/core": "^0.11.0",
16 |     "@hookform/resolvers": "^3.9.0",
17 |     "@radix-ui/react-alert-dialog": "^1.1.1",
18 |     "@radix-ui/react-dialog": "^1.1.1",
19 |     "@radix-ui/react-dropdown-menu": "^2.1.1",
20 |     "@radix-ui/react-label": "^2.1.0",
21 |     "@radix-ui/react-popover": "^1.1.1",
22 |     "@radix-ui/react-select": "^2.1.1",
23 |     "@radix-ui/react-separator": "^1.1.0",
24 |     "@radix-ui/react-tabs": "^1.1.0",
25 |     "@radix-ui/react-tooltip": "^1.1.2",
26 |     "@supabase/auth-helpers-nextjs": "^0.10.0",
27 |     "@supabase/supabase-js": "^2.44.3",
28 |     "@tanstack/react-query": "^5.51.1",
29 |     "ai": "^3.2.34",
30 |     "class-variance-authority": "^0.7.0",
31 |     "clsx": "^2.1.1",
32 |     "lucide-react": "^0.407.0",
33 |     "next": "14.2.5",
34 |     "react": "^18",
35 |     "react-dom": "^18",
36 |     "react-hook-form": "^7.52.1",
37 |     "react-hot-toast": "^2.4.1",
38 |     "react-markdown": "^9.0.1",
39 |     "react-syntax-highlighter": "^15.5.0",
40 |     "react-textarea-autosize": "^8.5.3",
41 |     "remark-gfm": "^4.0.0",
42 |     "tailwind-merge": "^2.4.0",
43 |     "tailwindcss-animate": "^1.0.7",
44 |     "zod": "^3.23.8"
45 |   },
46 |   "devDependencies": {
47 |     "@tailwindcss/typography": "^0.5.13",
48 |     "@types/node": "^20",
49 |     "@types/react": "^18",
50 |     "@types/react-dom": "^18",
51 |     "@types/react-syntax-highlighter": "^15.5.13",
52 |     "eslint": "^8",
53 |     "eslint-config-next": "14.2.5",
54 |     "postcss": "^8",
55 |     "tailwindcss": "^3.4.1",
56 |     "typescript": "^5"
57 |   }
58 | }
59 | 


--------------------------------------------------------------------------------
/postcss.config.mjs:
--------------------------------------------------------------------------------
1 | /** @type {import('postcss-load-config').Config} */
2 | const config = {
3 |   plugins: {
4 |     tailwindcss: {},
5 |   },
6 | };
7 | 
8 | export default config;
9 | 


--------------------------------------------------------------------------------
/public/anthropic.svg:
--------------------------------------------------------------------------------
1 | <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 143 16" width="143" height="16" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px); content-visibility: visible;"><defs><clipPath id="__lottie_element_2"><rect width="143" height="16" x="0" y="0"></rect></clipPath><clipPath id="__lottie_element_4"><path d="M0,0 L143,0 L143,16 L0,16z"></path></clipPath><g id="__lottie_element_8"><g transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(0,0,0)" fill-opacity="0" d=" M142.5,0 C142.5,0 142.5,16 142.5,16 C142.5,16 0,16 0,16 C0,16 0,0 0,0 C0,0 142.5,0 142.5,0z"></path></g></g></g><clipPath id="__lottie_element_12"><path d="M0,0 L143,0 L143,16 L0,16z"></path></clipPath><clipPath id="__lottie_element_17"><path d="M0,0 L143,0 L143,16 L0,16z"></path></clipPath><clipPath id="__lottie_element_26"><path d="M0,0 L143,0 L143,16 L0,16z"></path></clipPath><clipPath id="__lottie_element_35"><path d="M0,0 L143,0 L143,16 L0,16z"></path></clipPath><clipPath id="__lottie_element_44"><path d="M0,0 L143,0 L143,16 L0,16z"></path></clipPath><clipPath id="__lottie_element_53"><path d="M0,0 L143,0 L143,16 L0,16z"></path></clipPath><clipPath id="__lottie_element_62"><path d="M0,0 L143,0 L143,16 L0,16z"></path></clipPath><clipPath id="__lottie_element_71"><path d="M0,0 L143,0 L143,16 L0,16z"></path></clipPath><clipPath id="__lottie_element_80"><path d="M0,0 L143,0 L143,16 L0,16z"></path></clipPath><clipPath id="__lottie_element_89"><path d="M0,0 L143,0 L143,16 L0,16z"></path></clipPath></defs><g clip-path="url(#__lottie_element_2)"><g transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(249,249,247)" fill-opacity="0" d=" M142.5,0 C142.5,0 142.5,16 142.5,16 C142.5,16 0,16 0,16 C0,16 0,0 0,0 C0,0 142.5,0 142.5,0z"></path></g></g><g clip-path="url(#__lottie_element_4)" transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g clip-path="url(#__lottie_element_12)" transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g clip-path="url(#__lottie_element_89)" transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g transform="matrix(1,0,0,1,18.299999237060547,0.27000001072883606)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(24,24,24)" fill-opacity="1" d=" M10.716191291809082,10.829001426696777 C10.716191291809082,10.829001426696777 3.756195545196533,0 3.756195545196533,0 C3.756195545196533,0 0,0 0,0 C0,0 0,15.470022201538086 0,15.470022201538086 C0,15.470022201538086 3.2038140296936035,15.470022201538086 3.2038140296936035,15.470022201538086 C3.2038140296936035,15.470022201538086 3.2038140296936035,4.6410064697265625 3.2038140296936035,4.6410064697265625 C3.2038140296936035,4.6410064697265625 10.163809776306152,15.470022201538086 10.163809776306152,15.470022201538086 C10.163809776306152,15.470022201538086 13.919991493225098,15.470022201538086 13.919991493225098,15.470022201538086 C13.919991493225098,15.470022201538086 13.919991493225098,0 13.919991493225098,0 C13.919991493225098,0 10.716191291809082,0 10.716191291809082,0 C10.716191291809082,0 10.716191291809082,10.829001426696777 10.716191291809082,10.829001426696777 C10.716191291809082,10.829001426696777 10.716191291809082,10.829001426696777 10.716191291809082,10.829001426696777z"></path></g></g></g><g clip-path="url(#__lottie_element_80)" transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g transform="matrix(1,0,0,1,34.869998931884766,0.27000001072883606)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(24,24,24)" fill-opacity="1" d=" M0,2.983504056930542 C0,2.983504056930542 5.19273567199707,2.983504056930542 5.19273567199707,2.983504056930542 C5.19273567199707,2.983504056930542 5.19273567199707,15.470022201538086 5.19273567199707,15.470022201538086 C5.19273567199707,15.470022201538086 8.507256507873535,15.470022201538086 8.507256507873535,15.470022201538086 C8.507256507873535,15.470022201538086 8.507256507873535,2.983504056930542 8.507256507873535,2.983504056930542 C8.507256507873535,2.983504056930542 13.700006484985352,2.983504056930542 13.700006484985352,2.983504056930542 C13.700006484985352,2.983504056930542 13.700006484985352,0 13.700006484985352,0 C13.700006484985352,0 0,0 0,0 C0,0 0,2.983504056930542 0,2.983504056930542 C0,2.983504056930542 0,2.983504056930542 0,2.983504056930542z"></path></g></g></g><g clip-path="url(#__lottie_element_71)" transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g transform="matrix(1,0,0,1,51.22999954223633,0.27000001072883606)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(24,24,24)" fill-opacity="1" d=" M10.605714797973633,6.165900230407715 C10.605714797973633,6.165900230407715 3.3142902851104736,6.165900230407715 3.3142902851104736,6.165900230407715 C3.3142902851104736,6.165900230407715 3.3142902851104736,0 3.3142902851104736,0 C3.3142902851104736,0 0,0 0,0 C0,0 0,15.470022201538086 0,15.470022201538086 C0,15.470022201538086 3.3142902851104736,15.470022201538086 3.3142902851104736,15.470022201538086 C3.3142902851104736,15.470022201538086 3.3142902851104736,9.149404525756836 3.3142902851104736,9.149404525756836 C3.3142902851104736,9.149404525756836 10.605714797973633,9.149404525756836 10.605714797973633,9.149404525756836 C10.605714797973633,9.149404525756836 10.605714797973633,15.470022201538086 10.605714797973633,15.470022201538086 C10.605714797973633,15.470022201538086 13.919991493225098,15.470022201538086 13.919991493225098,15.470022201538086 C13.919991493225098,15.470022201538086 13.919991493225098,0 13.919991493225098,0 C13.919991493225098,0 10.605714797973633,0 10.605714797973633,0 C10.605714797973633,0 10.605714797973633,6.165900230407715 10.605714797973633,6.165900230407715 C10.605714797973633,6.165900230407715 10.605714797973633,6.165900230407715 10.605714797973633,6.165900230407715z"></path></g></g></g><g clip-path="url(#__lottie_element_62)" transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g transform="matrix(1,0,0,1,69.23999786376953,0.27000001072883606)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(24,24,24)" fill-opacity="1" d=" M3.3151700496673584,2.983504056930542 C3.3151700496673584,2.983504056930542 7.403865814208984,2.983504056930542 7.403865814208984,2.983504056930542 C9.03934097290039,2.983504056930542 9.901290893554688,3.5801939964294434 9.901290893554688,4.707304000854492 C9.901290893554688,5.834399700164795 9.03934097290039,6.431103706359863 7.403865814208984,6.431103706359863 C7.403865814208984,6.431103706359863 3.3151700496673584,6.431103706359863 3.3151700496673584,6.431103706359863 C3.3151700496673584,6.431103706359863 3.3151700496673584,2.983504056930542 3.3151700496673584,2.983504056930542 C3.3151700496673584,2.983504056930542 3.3151700496673584,2.983504056930542 3.3151700496673584,2.983504056930542z M13.216461181640625,4.707304000854492 C13.216461181640625,1.7900969982147217 11.072648048400879,0 7.558576583862305,0 C7.558576583862305,0 0,0 0,0 C0,0 0,15.470022201538086 0,15.470022201538086 C0,15.470022201538086 3.3151700496673584,15.470022201538086 3.3151700496673584,15.470022201538086 C3.3151700496673584,15.470022201538086 3.3151700496673584,9.414593696594238 3.3151700496673584,9.414593696594238 C3.3151700496673584,9.414593696594238 7.005825519561768,9.414593696594238 7.005825519561768,9.414593696594238 C7.005825519561768,9.414593696594238 10.321218490600586,15.470022201538086 10.321218490600586,15.470022201538086 C10.321218490600586,15.470022201538086 13.990056991577148,15.470022201538086 13.990056991577148,15.470022201538086 C13.990056991577148,15.470022201538086 10.319005966186523,8.953378677368164 10.319005966186523,8.953378677368164 C12.161579132080078,8.245061874389648 13.216461181640625,6.753532409667969 13.216461181640625,4.707304000854492 C13.216461181640625,4.707304000854492 13.216461181640625,4.707304000854492 13.216461181640625,4.707304000854492z"></path></g></g></g><g clip-path="url(#__lottie_element_53)" transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g transform="matrix(1,0,0,1,84.98999786376953,0)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(24,24,24)" fill-opacity="1" d=" M7.622087478637695,12.906073570251465 C5.015110492706299,12.906073570251465 3.4244225025177,11.049725532531738 3.4244225025177,8.022093772888184 C3.4244225025177,4.95027494430542 5.015110492706299,3.0939269065856934 7.622087478637695,3.0939269065856934 C10.206976890563965,3.0939269065856934 11.775577545166016,4.95027494430542 11.775577545166016,8.022093772888184 C11.775577545166016,11.049725532531738 10.206976890563965,12.906073570251465 7.622087478637695,12.906073570251465 C7.622087478637695,12.906073570251465 7.622087478637695,12.906073570251465 7.622087478637695,12.906073570251465z M7.622087478637695,0 C3.1593029499053955,0 0,3.3149218559265137 0,8.022093772888184 C0,12.685078620910645 3.1593029499053955,16 7.622087478637695,16 C12.062784194946289,16 15.200028419494629,12.685078620910645 15.200028419494629,8.022093772888184 C15.200028419494629,3.3149218559265137 12.062784194946289,0 7.622087478637695,0 C7.622087478637695,0 7.622087478637695,0 7.622087478637695,0z"></path></g></g></g><g clip-path="url(#__lottie_element_44)" transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g transform="matrix(1,0,0,1,103.29000091552734,0.27000001072883606)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(24,24,24)" fill-opacity="1" d=" M7.405848026275635,6.873104095458984 C7.405848026275635,6.873104095458984 3.3160574436187744,6.873104095458984 3.3160574436187744,6.873104095458984 C3.3160574436187744,6.873104095458984 3.3160574436187744,2.983504056930542 3.3160574436187744,2.983504056930542 C3.3160574436187744,2.983504056930542 7.405848026275635,2.983504056930542 7.405848026275635,2.983504056930542 C9.04176139831543,2.983504056930542 9.90394115447998,3.646505117416382 9.90394115447998,4.928304195404053 C9.90394115447998,6.2101030349731445 9.04176139831543,6.873104095458984 7.405848026275635,6.873104095458984 C7.405848026275635,6.873104095458984 7.405848026275635,6.873104095458984 7.405848026275635,6.873104095458984z M7.5605998039245605,0 C7.5605998039245605,0 0,0 0,0 C0,0 0,15.470022201538086 0,15.470022201538086 C0,15.470022201538086 3.3160574436187744,15.470022201538086 3.3160574436187744,15.470022201538086 C3.3160574436187744,15.470022201538086 3.3160574436187744,9.85659408569336 3.3160574436187744,9.85659408569336 C3.3160574436187744,9.85659408569336 7.5605998039245605,9.85659408569336 7.5605998039245605,9.85659408569336 C11.07561206817627,9.85659408569336 13.219999313354492,8.000200271606445 13.219999313354492,4.928304195404053 C13.219999313354492,1.8563942909240723 11.07561206817627,0 7.5605998039245605,0 C7.5605998039245605,0 7.5605998039245605,0 7.5605998039245605,0z"></path></g></g></g><g clip-path="url(#__lottie_element_35)" transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g transform="matrix(1,0,0,1,128.0399932861328,0)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(24,24,24)" fill-opacity="1" d=" M10.914844512939453,10.5414400100708 C10.340370178222656,12.044201850891113 9.191434860229492,12.906073570251465 7.622706890106201,12.906073570251465 C5.0155181884765625,12.906073570251465 3.4246866703033447,11.049725532531738 3.4246866703033447,8.022093772888184 C3.4246866703033447,4.95027494430542 5.0155181884765625,3.0939269065856934 7.622706890106201,3.0939269065856934 C9.191434860229492,3.0939269065856934 10.340370178222656,3.9557981491088867 10.914844512939453,5.458559989929199 C10.914844512939453,5.458559989929199 14.427860260009766,5.458559989929199 14.427860260009766,5.458559989929199 C13.566211700439453,2.1436522006988525 10.981111526489258,0 7.622706890106201,0 C3.1595458984375,0 0,3.3149218559265137 0,8.022093772888184 C0,12.685078620910645 3.1595458984375,16 7.622706890106201,16 C11.003214836120605,16 13.588300704956055,13.834254264831543 14.449976921081543,10.5414400100708 C14.449976921081543,10.5414400100708 10.914844512939453,10.5414400100708 10.914844512939453,10.5414400100708 C10.914844512939453,10.5414400100708 10.914844512939453,10.5414400100708 10.914844512939453,10.5414400100708z"></path></g></g></g><g clip-path="url(#__lottie_element_26)" transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g transform="matrix(1,0,0,1,117.83000183105469,0.27000001072883606)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(24,24,24)" fill-opacity="1" d=" M0,0 C0,0 6.1677093505859375,15.470022201538086 6.1677093505859375,15.470022201538086 C6.1677093505859375,15.470022201538086 9.550004005432129,15.470022201538086 9.550004005432129,15.470022201538086 C9.550004005432129,15.470022201538086 3.382294178009033,0 3.382294178009033,0 C3.382294178009033,0 0,0 0,0 C0,0 0,0 0,0z"></path></g></g></g><g clip-path="url(#__lottie_element_17)" transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g transform="matrix(1,0,0,1,0,0.27000001072883606)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(24,24,24)" fill-opacity="1" d=" M5.824605464935303,9.348296165466309 C5.824605464935303,9.348296165466309 7.93500280380249,3.911694288253784 7.93500280380249,3.911694288253784 C7.93500280380249,3.911694288253784 10.045400619506836,9.348296165466309 10.045400619506836,9.348296165466309 C10.045400619506836,9.348296165466309 5.824605464935303,9.348296165466309 5.824605464935303,9.348296165466309 C5.824605464935303,9.348296165466309 5.824605464935303,9.348296165466309 5.824605464935303,9.348296165466309z M6.166755199432373,0 C6.166755199432373,0 0,15.470022201538086 0,15.470022201538086 C0,15.470022201538086 3.4480772018432617,15.470022201538086 3.4480772018432617,15.470022201538086 C3.4480772018432617,15.470022201538086 4.709278583526611,12.22130012512207 4.709278583526611,12.22130012512207 C4.709278583526611,12.22130012512207 11.16093635559082,12.22130012512207 11.16093635559082,12.22130012512207 C11.16093635559082,12.22130012512207 12.421928405761719,15.470022201538086 12.421928405761719,15.470022201538086 C12.421928405761719,15.470022201538086 15.87000560760498,15.470022201538086 15.87000560760498,15.470022201538086 C15.87000560760498,15.470022201538086 9.703250885009766,0 9.703250885009766,0 C9.703250885009766,0 6.166755199432373,0 6.166755199432373,0 C6.166755199432373,0 6.166755199432373,0 6.166755199432373,0z"></path></g></g></g></g></g></g></svg>


--------------------------------------------------------------------------------
/public/crop-and-talk.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/13point5/open-artifacts/main/public/crop-and-talk.png


--------------------------------------------------------------------------------
/public/demo.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/13point5/open-artifacts/main/public/demo.png


--------------------------------------------------------------------------------
/public/github.svg:
--------------------------------------------------------------------------------
1 | <svg width="98" height="96" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f"/></svg>


--------------------------------------------------------------------------------
/public/google.svg:
--------------------------------------------------------------------------------
 1 | <svg
 2 |   viewBox="0 0 24 24"
 3 |   xmlns="http://www.w3.org/2000/svg"
 4 | >
 5 |   <path
 6 |     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
 7 |     fill="#4285F4"
 8 |   />
 9 |   <path
10 |     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
11 |     fill="#34A853"
12 |   />
13 |   <path
14 |     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
15 |     fill="#FBBC05"
16 |   />
17 |   <path
18 |     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
19 |     fill="#EA4335"
20 |   />
21 | </svg>


--------------------------------------------------------------------------------
/public/next.svg:
--------------------------------------------------------------------------------
1 | <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>


--------------------------------------------------------------------------------
/public/openai.svg:
--------------------------------------------------------------------------------
1 | 
2 | <svg viewBox="0 0 1180 320" xmlns="http://www.w3.org/2000/svg"><path d="m367.44 153.84c0 52.32 33.6 88.8 80.16 88.8s80.16-36.48 80.16-88.8-33.6-88.8-80.16-88.8-80.16 36.48-80.16 88.8zm129.6 0c0 37.44-20.4 61.68-49.44 61.68s-49.44-24.24-49.44-61.68 20.4-61.68 49.44-61.68 49.44 24.24 49.44 61.68z"/><path d="m614.27 242.64c35.28 0 55.44-29.76 55.44-65.52s-20.16-65.52-55.44-65.52c-16.32 0-28.32 6.48-36.24 15.84v-13.44h-28.8v169.2h28.8v-56.4c7.92 9.36 19.92 15.84 36.24 15.84zm-36.96-69.12c0-23.76 13.44-36.72 31.2-36.72 20.88 0 32.16 16.32 32.16 40.32s-11.28 40.32-32.16 40.32c-17.76 0-31.2-13.2-31.2-36.48z"/><path d="m747.65 242.64c25.2 0 45.12-13.2 54-35.28l-24.72-9.36c-3.84 12.96-15.12 20.16-29.28 20.16-18.48 0-31.44-13.2-33.6-34.8h88.32v-9.6c0-34.56-19.44-62.16-55.92-62.16s-60 28.56-60 65.52c0 38.88 25.2 65.52 61.2 65.52zm-1.44-106.8c18.24 0 26.88 12 27.12 25.92h-57.84c4.32-17.04 15.84-25.92 30.72-25.92z"/><path d="m823.98 240h28.8v-73.92c0-18 13.2-27.6 26.16-27.6 15.84 0 22.08 11.28 22.08 26.88v74.64h28.8v-83.04c0-27.12-15.84-45.36-42.24-45.36-16.32 0-27.6 7.44-34.8 15.84v-13.44h-28.8z"/><path d="m1014.17 67.68-65.28 172.32h30.48l14.64-39.36h74.4l14.88 39.36h30.96l-65.28-172.32zm16.8 34.08 27.36 72h-54.24z"/><path d="m1163.69 68.18h-30.72v172.32h30.72z"/><path d="m297.06 130.97c7.26-21.79 4.76-45.66-6.85-65.48-17.46-30.4-52.56-46.04-86.84-38.68-15.25-17.18-37.16-26.95-60.13-26.81-35.04-.08-66.13 22.48-76.91 55.82-22.51 4.61-41.94 18.7-53.31 38.67-17.59 30.32-13.58 68.54 9.92 94.54-7.26 21.79-4.76 45.66 6.85 65.48 17.46 30.4 52.56 46.04 86.84 38.68 15.24 17.18 37.16 26.95 60.13 26.8 35.06.09 66.16-22.49 76.94-55.86 22.51-4.61 41.94-18.7 53.31-38.67 17.57-30.32 13.55-68.51-9.94-94.51zm-120.28 168.11c-14.03.02-27.62-4.89-38.39-13.88.49-.26 1.34-.73 1.89-1.07l63.72-36.8c3.26-1.85 5.26-5.32 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97zm-128.84-55.03c-7.03-12.14-9.56-26.37-7.15-40.18.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83l-64.41 37.19c-28.69 16.52-65.33 6.7-81.92-21.95zm-16.77-139.09c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91-26.93 15.55c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94-7.01 12.14-18.05 21.44-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8c-3.23-1.89-7.23-1.89-10.47 0l-77.79 44.92v-31.1c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22 6.99 12.12 9.52 26.31 7.15 40.1zm-168.51 55.43-26.94-15.55c-.29-.14-.48-.42-.52-.74v-74.39c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07l-63.72 36.8c-3.26 1.85-5.26 5.31-5.24 9.06l-.04 89.79zm14.63-31.54 34.65-20.01 34.65 20v40.01l-34.65 20-34.65-20z"/></svg>


--------------------------------------------------------------------------------
/public/vercel.svg:
--------------------------------------------------------------------------------
1 | <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 283 64"><path fill="black" d="M141 16c-11 0-19 7-19 18s9 18 20 18c7 0 13-3 16-7l-7-5c-2 3-6 4-9 4-5 0-9-3-10-7h28v-3c0-11-8-18-19-18zm-9 15c1-4 4-7 9-7s8 3 9 7h-18zm117-15c-11 0-19 7-19 18s9 18 20 18c6 0 12-3 16-7l-8-5c-2 3-5 4-8 4-5 0-9-3-11-7h28l1-3c0-11-8-18-19-18zm-10 15c2-4 5-7 10-7s8 3 9 7h-19zm-39 3c0 6 4 10 10 10 4 0 7-2 9-5l8 5c-3 5-9 8-17 8-11 0-19-7-19-18s8-18 19-18c8 0 14 3 17 8l-8 5c-2-3-5-5-9-5-6 0-10 4-10 10zm83-29v46h-9V5h9zM37 0l37 64H0L37 0zm92 5-27 48L74 5h10l18 30 17-30h10zm59 12v10l-3-1c-6 0-10 4-10 10v15h-9V17h9v9c0-5 6-9 13-9z"/></svg>


--------------------------------------------------------------------------------
/supabase/.gitignore:
--------------------------------------------------------------------------------
1 | # Supabase
2 | .branches
3 | .temp
4 | .env
5 | 


--------------------------------------------------------------------------------
/supabase/config.toml:
--------------------------------------------------------------------------------
  1 | # A string used to distinguish different Supabase projects on the same host. Defaults to the
  2 | # working directory name when running `supabase init`.
  3 | project_id = "open-artifacts"
  4 | 
  5 | [api]
  6 | enabled = true
  7 | # Port to use for the API URL.
  8 | port = 54321
  9 | # Schemas to expose in your API. Tables, views and stored procedures in this schema will get API
 10 | # endpoints. `public` is always included.
 11 | schemas = ["public", "graphql_public"]
 12 | # Extra schemas to add to the search_path of every request. `public` is always included.
 13 | extra_search_path = ["public", "extensions"]
 14 | # The maximum number of rows returns from a view, table, or stored procedure. Limits payload size
 15 | # for accidental or malicious requests.
 16 | max_rows = 1000
 17 | 
 18 | [db]
 19 | # Port to use for the local database URL.
 20 | port = 54322
 21 | # Port used by db diff command to initialize the shadow database.
 22 | shadow_port = 54320
 23 | # The database major version to use. This has to be the same as your remote database's. Run `SHOW
 24 | # server_version;` on the remote database to check.
 25 | major_version = 15
 26 | 
 27 | [db.pooler]
 28 | enabled = false
 29 | # Port to use for the local connection pooler.
 30 | port = 54329
 31 | # Specifies when a server connection can be reused by other clients.
 32 | # Configure one of the supported pooler modes: `transaction`, `session`.
 33 | pool_mode = "transaction"
 34 | # How many server connections to allow per user/database pair.
 35 | default_pool_size = 20
 36 | # Maximum number of client connections allowed.
 37 | max_client_conn = 100
 38 | 
 39 | [realtime]
 40 | enabled = true
 41 | # Bind realtime via either IPv4 or IPv6. (default: IPv4)
 42 | # ip_version = "IPv6"
 43 | # The maximum length in bytes of HTTP request headers. (default: 4096)
 44 | # max_header_length = 4096
 45 | 
 46 | [studio]
 47 | enabled = true
 48 | # Port to use for Supabase Studio.
 49 | port = 54323
 50 | # External URL of the API server that frontend connects to.
 51 | api_url = "http://127.0.0.1"
 52 | # OpenAI API Key to use for Supabase AI in the Supabase Studio.
 53 | openai_api_key = "env(OPENAI_API_KEY)"
 54 | 
 55 | # Email testing server. Emails sent with the local dev setup are not actually sent - rather, they
 56 | # are monitored, and you can view the emails that would have been sent from the web interface.
 57 | [inbucket]
 58 | enabled = true
 59 | # Port to use for the email testing server web interface.
 60 | port = 54324
 61 | # Uncomment to expose additional ports for testing user applications that send emails.
 62 | # smtp_port = 54325
 63 | # pop3_port = 54326
 64 | 
 65 | [storage]
 66 | enabled = true
 67 | # The maximum file size allowed (e.g. "5MB", "500KB").
 68 | file_size_limit = "50MiB"
 69 | 
 70 | [storage.image_transformation]
 71 | enabled = true
 72 | 
 73 | [auth]
 74 | enabled = true
 75 | # The base URL of your website. Used as an allow-list for redirects and for constructing URLs used
 76 | # in emails.
 77 | site_url = "http://127.0.0.1:3000"
 78 | # A list of *exact* URLs that auth providers are permitted to redirect to post authentication.
 79 | additional_redirect_urls = ["https://127.0.0.1:3000"]
 80 | # How long tokens are valid for, in seconds. Defaults to 3600 (1 hour), maximum 604,800 (1 week).
 81 | jwt_expiry = 3600
 82 | # If disabled, the refresh token will never expire.
 83 | enable_refresh_token_rotation = true
 84 | # Allows refresh tokens to be reused after expiry, up to the specified interval in seconds.
 85 | # Requires enable_refresh_token_rotation = true.
 86 | refresh_token_reuse_interval = 10
 87 | # Allow/disallow new user signups to your project.
 88 | enable_signup = true
 89 | # Allow/disallow anonymous sign-ins to your project.
 90 | enable_anonymous_sign_ins = false
 91 | # Allow/disallow testing manual linking of accounts
 92 | enable_manual_linking = false
 93 | 
 94 | [auth.email]
 95 | # Allow/disallow new user signups via email to your project.
 96 | enable_signup = true
 97 | # If enabled, a user will be required to confirm any email change on both the old, and new email
 98 | # addresses. If disabled, only the new email is required to confirm.
 99 | double_confirm_changes = true
100 | # If enabled, users need to confirm their email address before signing in.
101 | enable_confirmations = false
102 | # Controls the minimum amount of time that must pass before sending another signup confirmation or password reset email.
103 | max_frequency = "1s"
104 | 
105 | # Uncomment to customize email template
106 | # [auth.email.template.invite]
107 | # subject = "You have been invited"
108 | # content_path = "./supabase/templates/invite.html"
109 | 
110 | [auth.sms]
111 | # Allow/disallow new user signups via SMS to your project.
112 | enable_signup = true
113 | # If enabled, users need to confirm their phone number before signing in.
114 | enable_confirmations = false
115 | # Template for sending OTP to users
116 | template = "Your code is {{ .Code }} ."
117 | # Controls the minimum amount of time that must pass before sending another sms otp.
118 | max_frequency = "5s"
119 | 
120 | # Use pre-defined map of phone number to OTP for testing.
121 | # [auth.sms.test_otp]
122 | # 4152127777 = "123456"
123 | 
124 | # This hook runs before a token is issued and allows you to add additional claims based on the authentication method used.
125 | # [auth.hook.custom_access_token]
126 | # enabled = true
127 | # uri = "pg-functions://<database>/<schema>/<hook_name>"
128 | 
129 | # Configure one of the supported SMS providers: `twilio`, `twilio_verify`, `messagebird`, `textlocal`, `vonage`.
130 | [auth.sms.twilio]
131 | enabled = false
132 | account_sid = ""
133 | message_service_sid = ""
134 | # DO NOT commit your Twilio auth token to git. Use environment variable substitution instead:
135 | auth_token = "env(SUPABASE_AUTH_SMS_TWILIO_AUTH_TOKEN)"
136 | 
137 | # Use an external OAuth provider. The full list of providers are: `apple`, `azure`, `bitbucket`,
138 | # `discord`, `facebook`, `github`, `gitlab`, `google`, `keycloak`, `linkedin_oidc`, `notion`, `twitch`,
139 | # `twitter`, `slack`, `spotify`, `workos`, `zoom`.
140 | [auth.external.apple]
141 | enabled = false
142 | client_id = ""
143 | # DO NOT commit your OAuth provider secret to git. Use environment variable substitution instead:
144 | secret = "env(SUPABASE_AUTH_EXTERNAL_APPLE_SECRET)"
145 | # Overrides the default auth redirectUrl.
146 | redirect_uri = ""
147 | # Overrides the default auth provider URL. Used to support self-hosted gitlab, single-tenant Azure,
148 | # or any other third-party OIDC providers.
149 | url = ""
150 | # If enabled, the nonce check will be skipped. Required for local sign in with Google auth.
151 | skip_nonce_check = false
152 | 
153 | [edge_runtime]
154 | enabled = true
155 | # Configure one of the supported request policies: `oneshot`, `per_worker`.
156 | # Use `oneshot` for hot reload, or `per_worker` for load testing.
157 | policy = "oneshot"
158 | inspector_port = 8083
159 | 
160 | [analytics]
161 | enabled = false
162 | port = 54327
163 | vector_port = 54328
164 | # Configure one of the supported backends: `postgres`, `bigquery`.
165 | backend = "postgres"
166 | 
167 | # Experimental features may be deprecated any time
168 | [experimental]
169 | # Configures Postgres storage engine to use OrioleDB (S3)
170 | orioledb_version = ""
171 | # Configures S3 bucket URL, eg. <bucket_name>.s3-<region>.amazonaws.com
172 | s3_host = "env(S3_HOST)"
173 | # Configures S3 bucket region, eg. us-east-1
174 | s3_region = "env(S3_REGION)"
175 | # Configures AWS_ACCESS_KEY_ID for S3 bucket
176 | s3_access_key = "env(S3_ACCESS_KEY)"
177 | # Configures AWS_SECRET_ACCESS_KEY for S3 bucket
178 | s3_secret_key = "env(S3_SECRET_KEY)"
179 | 


--------------------------------------------------------------------------------
/supabase/migrations/20240720132926_remote_schema.sql:
--------------------------------------------------------------------------------
  1 | 
  2 | SET statement_timeout = 0;
  3 | SET lock_timeout = 0;
  4 | SET idle_in_transaction_session_timeout = 0;
  5 | SET client_encoding = 'UTF8';
  6 | SET standard_conforming_strings = on;
  7 | SELECT pg_catalog.set_config('search_path', '', false);
  8 | SET check_function_bodies = false;
  9 | SET xmloption = content;
 10 | SET client_min_messages = warning;
 11 | SET row_security = off;
 12 | 
 13 | CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";
 14 | 
 15 | COMMENT ON SCHEMA "public" IS 'standard public schema';
 16 | 
 17 | CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
 18 | 
 19 | CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
 20 | 
 21 | CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
 22 | 
 23 | CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";
 24 | 
 25 | CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
 26 | 
 27 | CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
 28 | 
 29 | CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
 30 |     LANGUAGE "plpgsql" SECURITY DEFINER
 31 |     AS $
 32 | begin
 33 |   insert into public.profiles (id, full_name, avatar_url)
 34 |   values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
 35 |   return new;
 36 | end;
 37 | $;
 38 | 
 39 | ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";
 40 | 
 41 | SET default_tablespace = '';
 42 | 
 43 | SET default_table_access_method = "heap";
 44 | 
 45 | CREATE TABLE IF NOT EXISTS "public"."chats" (
 46 |     "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
 47 |     "title" "text" NOT NULL,
 48 |     "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
 49 |     "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
 50 | );
 51 | 
 52 | ALTER TABLE "public"."chats" OWNER TO "postgres";
 53 | 
 54 | CREATE TABLE IF NOT EXISTS "public"."messages" (
 55 |     "id" bigint NOT NULL,
 56 |     "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
 57 |     "text" "text" NOT NULL,
 58 |     "metadata" "jsonb",
 59 |     "chat_id" "uuid" NOT NULL,
 60 |     "role" "text" NOT NULL,
 61 |     "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
 62 |     "attachments" "jsonb"
 63 | );
 64 | 
 65 | ALTER TABLE "public"."messages" OWNER TO "postgres";
 66 | 
 67 | ALTER TABLE "public"."messages" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
 68 |     SEQUENCE NAME "public"."messages_id_seq"
 69 |     START WITH 1
 70 |     INCREMENT BY 1
 71 |     NO MINVALUE
 72 |     NO MAXVALUE
 73 |     CACHE 1
 74 | );
 75 | 
 76 | CREATE TABLE IF NOT EXISTS "public"."profiles" (
 77 |     "id" "uuid" NOT NULL,
 78 |     "updated_at" timestamp with time zone,
 79 |     "full_name" "text",
 80 |     "avatar_url" "text"
 81 | );
 82 | 
 83 | ALTER TABLE "public"."profiles" OWNER TO "postgres";
 84 | 
 85 | ALTER TABLE ONLY "public"."chats"
 86 |     ADD CONSTRAINT "chats_pkey" PRIMARY KEY ("id");
 87 | 
 88 | ALTER TABLE ONLY "public"."messages"
 89 |     ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");
 90 | 
 91 | ALTER TABLE ONLY "public"."profiles"
 92 |     ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");
 93 | 
 94 | ALTER TABLE ONLY "public"."messages"
 95 |     ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id");
 96 | 
 97 | ALTER TABLE ONLY "public"."profiles"
 98 |     ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;
 99 | 
100 | CREATE POLICY "Enable delete for users based on user_id" ON "public"."chats" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));
101 | 
102 | CREATE POLICY "Enable delete for users based on user_id" ON "public"."messages" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));
103 | 
104 | CREATE POLICY "Enable insert for authenticated users only" ON "public"."chats" FOR INSERT TO "authenticated" WITH CHECK (true);
105 | 
106 | CREATE POLICY "Enable insert for authenticated users only" ON "public"."messages" FOR INSERT TO "authenticated" WITH CHECK (true);
107 | 
108 | CREATE POLICY "Enable read access based on user_id" ON "public"."chats" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));
109 | 
110 | CREATE POLICY "Enable read access based on user_id" ON "public"."messages" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));
111 | 
112 | CREATE POLICY "Enable update access based on user_id" ON "public"."chats" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));
113 | 
114 | CREATE POLICY "Enable update for users based on user_id" ON "public"."messages" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));
115 | 
116 | CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);
117 | 
118 | CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));
119 | 
120 | CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));
121 | 
122 | ALTER TABLE "public"."chats" ENABLE ROW LEVEL SECURITY;
123 | 
124 | ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;
125 | 
126 | ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
127 | 
128 | ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";
129 | 
130 | ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."chats";
131 | 
132 | GRANT USAGE ON SCHEMA "public" TO "postgres";
133 | GRANT USAGE ON SCHEMA "public" TO "anon";
134 | GRANT USAGE ON SCHEMA "public" TO "authenticated";
135 | GRANT USAGE ON SCHEMA "public" TO "service_role";
136 | 
137 | GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
138 | GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
139 | GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";
140 | 
141 | GRANT ALL ON TABLE "public"."chats" TO "anon";
142 | GRANT ALL ON TABLE "public"."chats" TO "authenticated";
143 | GRANT ALL ON TABLE "public"."chats" TO "service_role";
144 | 
145 | GRANT ALL ON TABLE "public"."messages" TO "anon";
146 | GRANT ALL ON TABLE "public"."messages" TO "authenticated";
147 | GRANT ALL ON TABLE "public"."messages" TO "service_role";
148 | 
149 | GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "anon";
150 | GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "authenticated";
151 | GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "service_role";
152 | 
153 | GRANT ALL ON TABLE "public"."profiles" TO "anon";
154 | GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
155 | GRANT ALL ON TABLE "public"."profiles" TO "service_role";
156 | 
157 | ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
158 | ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
159 | ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
160 | ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";
161 | 
162 | ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
163 | ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
164 | ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
165 | ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";
166 | 
167 | ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
168 | ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
169 | ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
170 | ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";
171 | 
172 | RESET ALL;
173 | 


--------------------------------------------------------------------------------
/supabase/migrations/20240720133004_remote_schema.sql:
--------------------------------------------------------------------------------
 1 | CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();
 2 | 
 3 | 
 4 | create policy "Anyone can upload an avatar."
 5 | on "storage"."objects"
 6 | as permissive
 7 | for insert
 8 | to public
 9 | with check ((bucket_id = 'avatars'::text));
10 | 
11 | 
12 | create policy "Avatar images are publicly accessible."
13 | on "storage"."objects"
14 | as permissive
15 | for select
16 | to public
17 | using ((bucket_id = 'avatars'::text));
18 | 
19 | 
20 | 
21 | 


--------------------------------------------------------------------------------
/supabase/seed.sql:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/13point5/open-artifacts/main/supabase/seed.sql


--------------------------------------------------------------------------------
/tailwind.config.ts:
--------------------------------------------------------------------------------
 1 | import type { Config } from "tailwindcss";
 2 | 
 3 | const config = {
 4 |   darkMode: ["class"],
 5 |   content: [
 6 |     "./pages/**/*.{ts,tsx}",
 7 |     "./components/**/*.{ts,tsx}",
 8 |     "./app/**/*.{ts,tsx}",
 9 |     "./src/**/*.{ts,tsx}",
10 |   ],
11 |   prefix: "",
12 |   theme: {
13 |     container: {
14 |       center: true,
15 |       padding: "2rem",
16 |       screens: {
17 |         "2xl": "1400px",
18 |       },
19 |     },
20 |     extend: {
21 |       colors: {
22 |         border: "hsl(var(--border))",
23 |         input: "hsl(var(--input))",
24 |         ring: "hsl(var(--ring))",
25 |         background: "hsl(var(--background))",
26 |         foreground: "hsl(var(--foreground))",
27 |         primary: {
28 |           DEFAULT: "hsl(var(--primary))",
29 |           foreground: "hsl(var(--primary-foreground))",
30 |         },
31 |         secondary: {
32 |           DEFAULT: "hsl(var(--secondary))",
33 |           foreground: "hsl(var(--secondary-foreground))",
34 |         },
35 |         destructive: {
36 |           DEFAULT: "hsl(var(--destructive))",
37 |           foreground: "hsl(var(--destructive-foreground))",
38 |         },
39 |         muted: {
40 |           DEFAULT: "hsl(var(--muted))",
41 |           foreground: "hsl(var(--muted-foreground))",
42 |         },
43 |         accent: {
44 |           DEFAULT: "hsl(var(--accent))",
45 |           foreground: "hsl(var(--accent-foreground))",
46 |         },
47 |         popover: {
48 |           DEFAULT: "hsl(var(--popover))",
49 |           foreground: "hsl(var(--popover-foreground))",
50 |         },
51 |         card: {
52 |           DEFAULT: "hsl(var(--card))",
53 |           foreground: "hsl(var(--card-foreground))",
54 |         },
55 |       },
56 |       borderRadius: {
57 |         lg: "var(--radius)",
58 |         md: "calc(var(--radius) - 2px)",
59 |         sm: "calc(var(--radius) - 4px)",
60 |       },
61 |       keyframes: {
62 |         "accordion-down": {
63 |           from: { height: "0" },
64 |           to: { height: "var(--radix-accordion-content-height)" },
65 |         },
66 |         "accordion-up": {
67 |           from: { height: "var(--radix-accordion-content-height)" },
68 |           to: { height: "0" },
69 |         },
70 |       },
71 |       animation: {
72 |         "accordion-down": "accordion-down 0.2s ease-out",
73 |         "accordion-up": "accordion-up 0.2s ease-out",
74 |       },
75 |     },
76 |   },
77 |   plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
78 | } satisfies Config;
79 | 
80 | export default config;
81 | 


--------------------------------------------------------------------------------
/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "compilerOptions": {
 3 |     "lib": ["dom", "dom.iterable", "esnext"],
 4 |     "allowJs": true,
 5 |     "skipLibCheck": true,
 6 |     "strict": true,
 7 |     "noEmit": true,
 8 |     "esModuleInterop": true,
 9 |     "module": "esnext",
10 |     "moduleResolution": "bundler",
11 |     "resolveJsonModule": true,
12 |     "isolatedModules": true,
13 |     "jsx": "preserve",
14 |     "incremental": true,
15 |     "plugins": [
16 |       {
17 |         "name": "next"
18 |       }
19 |     ],
20 |     "paths": {
21 |       "@/*": ["./*"]
22 |     }
23 |   },
24 |   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
25 |   "exclude": ["node_modules"]
26 | }
27 | 


--------------------------------------------------------------------------------
```

# .cursor/rules/tasklist.md

```md
# Copilot Chat Implementation Tasklist

This tasklist outlines the changes needed to implement copilot chat improvements compared to our current codebase.

## Overview

We plan to adopt and integrate the structure defined in `@artifactsUI.md` to replace usage of `<editor_content>` tags with `<artifact>` tags. Additionally, we will:

- Introduce a system prompt mechanism for the editor using artifact-based tags (e.g., <artifact> for editor content and a separate tag for system prompts).
- Implement chat history support to store and display previous interactions.
- Enhance parsing logic for chat messages based on our current implementation in `components/tailwind/copilot/use-copilot.ts`.

## Current Codebase State

- The file `components/tailwind/copilot/use-copilot.ts` contains a helper function `extractEditorContent` that extracts content from `<editor_content>` tags.
- The copilot hook updates the editor content using `parseMarkdownToContent`, and there is no chat history persistence or dedicated artifact handling.

## Required Changes

### 1. Artifact Tag Structure

- [ ] Replace `<editor_content>` tags with `<artifact>` tags in markdown responses.
- [ ] Update extraction/parsing functions to detect and process `<artifact>` tags.
- [ ] Introduce a mechanism for a system prompt using a dedicated tag (e.g., `<system_prompt>` or similar) that follows the artifact structure.
- [ ] Ensure backward compatibility or a migration strategy from `<editor_content>` to `<artifact>` if necessary.

### 2. Chat History Implementation

- [ ] Implement chat history support within the copilot chat flow:
  - Persist previous messages (both user and assistant) within the UI state or local storage.
  - Display a chat history pane for context.
- [ ] Modify the API call to incorporate chat history context when sending prompts.

### 3. Enhanced Message Parsing

- [ ] Extend the parsing logic in `parseMarkdownToContent` to handle new artifact tags and any system prompt tags.
- [ ] Create or update message parsing routines to process multiple artifacts or artifacts from varied roles (e.g., system, user, assistant).

### 4. UI Updates

- [ ] Integrate UI components from the structure defined in `@artifactsUI.md`:
  - Adjust the layout to display artifacts alongside chat messages.
  - Update Tailwind CSS configurations if necessary to style new elements.
- [ ] Revise the copilot chat UI to support chat history and the new artifact-based content display.

### 5. Documentation & Testing

- [ ] Update documentation (README, inline comments, etc.) to reflect the new artifact tagging system and chat history features.
- [ ] Add unit and integration tests to cover:
  - New parsing functions for `<artifact>` and system prompt tags.
  - Chat history functionality and UI rendering.

### 6. Codebase Comparison & Cleanup

- [ ] Audit the codebase for references to `<editor_content>` and update them to `<artifact>` where appropriate.
- [ ] Compare current implementation in `components/tailwind/copilot/use-copilot.ts` with the new requirements outlined above.
- [ ] Refactor legacy code segments that are incompatible with the new artifact and chat history structures.

## Additional Considerations

- Maintain robust error handling in parsing functions to gracefully handle missing or malformed tags.
- Ensure clear role identification in messages (e.g., user vs assistant) after migration.
- Develop a migration strategy for existing content if switching tag types.

## Next Steps

1. Finalize the design for artifact and system prompt tag integration based on `@artifactsUI.md`.
2. Create a feature branch to implement the changes incrementally.
3. Integrate chat history functionality and update the API communication accordingly.
4. Thoroughly test all changes, update documentation, and ensure a smooth transition from the current system. 
```

# .gitignore

```
.vercel

```

# .prettierignore

```
pnpm-lock.yaml
yarn.lock
node_modules
.next
```

# app/api/copilot/route.ts

```ts
import { openai } from "@ai-sdk/openai";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { streamText } from "ai";
import { match } from "ts-pattern";
import { systemPrompt } from "./systemPrompt";

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
export const runtime = "edge";
console.log(process.env.OPENAI_API_KEY);
export async function POST(req: Request): Promise<Response> {
  // Check if the OPENAI_API_KEY is set, if not return 400
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "") {
    return new Response("Missing OPENAI_API_KEY - make sure to add it to your .env file.", {
      status: 400,
    });
  }
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const ip = req.headers.get("x-forwarded-for");
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(50, "1 d"),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(`novel_ratelimit_${ip}`);

    if (!success) {
      return new Response("You have reached your request limit for the day.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  }
  const { prompt, option, command } = await req.json();
  console.log("Request before sending in copilot: ", { prompt, option, command }); // Added console log for the request
  const messages = match(option)
    .with("copilot-write", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that generates text based on a prompt. " +
          "You take an input from the user and a command for rewriting the text or writing a new text. " +
          "Use rich Markdown formatting to enhance the text structure and readability. You can use: " +
          "\n- **Bold text** for emphasis" +
          "\n- *Italic text* for subtle emphasis" +
          "\n- `Code blocks` for technical terms" +
          "\n- ~~Strikethrough~~ for revisions" +
          "\n- # Headings (levels 1-6)" +
          "\n- Bullet lists" +
          "\n- Numbered lists" +
          "\n- \`\`\`language\nCode blocks with syntax highlighting\n\`\`\`" +
          "\n- [Links](https://example.com) for references" +
          "\n- ![Images](https://example.com/image.jpg) for visual content" +
          "\n- > Blockquotes for highlighting important text" +
          "\n- --- for horizontal rules to separate sections" +
          "\nMake the text engaging and well-structured using these formatting options. " +
          "When including links, ensure they are properly formatted and relevant. " +
          "For images, provide descriptive alt text. " +
          "Use blockquotes to highlight key points or quotes. " +
          "Structure the content with appropriate headings and sections." +
          "It is **crucially important** to write **all** of the article content **within** <editor_content></editor_content> tags. **Any** friendly chat can occur **outside** of these tags, but **failure** to follow this guideline may lead to **unexpected results**." +
          "\n\nHere are some examples of well-formatted responses:" +
          "\n\nExample 1 (Command: 'Write a technical guide about React hooks'):" +
          "\nHi! I'll help you write a technical guide about React hooks." +
          "\n<editor_content>" +
          "\n# Understanding React Hooks" +
          "\n\n## What are Hooks?" +
          "\nHooks are special functions that allow you to use state and other React features in functional components. Let's explore the most common ones:" +
          "\n\n### useState" +
          "\n\`\`\`javascript\nconst [count, setCount] = useState(0);\n\`\`\`" +
          "\n\n> **Important**: Hooks must be called at the top level of your component." +
          "\n</editor_content>" +
          "\n\nThank you for using our AI writing assistant! If you have any further questions or need additional help, feel free to ask. I'm here to assist you in crafting the best content possible. Happy writing!" +
          "\n\nExample 2 (Command: 'Make this text more professional'):" +
          "\nI'll help you make the text more professional." +
          "\n<editor_content>" +          
          "\n## Professional Communication Guidelines" +
          "\n\nEffective professional communication relies on three key principles:" +
          "\n\n1. **Clarity** - Use precise language" +
          "\n2. **Conciseness** - Be brief yet comprehensive" +
          "\n3. **Courtesy** - Maintain a respectful tone" +
          "\n\n---" +
          "\n\n> \"Professional communication is the cornerstone of business success.\"" +
          "\n</editor_content>" +
          "\n\nIf you have any further questions or need additional help, feel free to ask. I'm here to assist you in crafting the best content possible. Happy writing!" +
          "\n\nExample 3 (Command: 'Write about AI safety'):" +
          "\nI'll create an informative piece about AI safety." +
          "\n<editor_content>" +
          "\n# Artificial Intelligence Safety: A Critical Overview" +
          "\n\n![AI Safety Concept](https://example.com/ai-safety.jpg)" +
          "\n\n## Key Considerations" +
          "\n\n* **Ethical Framework**" +
          "\n* **Technical Robustness**" +
          "\n* **Societal Impact**" +
          "\n\nLearn more about AI safety at [AI Safety Resources](https://example.com/ai-safety)" +
          "\n</editor_content>" +
          "\n\nThank you for using our AI writing assistant! If you have any further questions or need additional help, feel free to ask. I'm here to assist you in crafting the best content possible. Happy writing!",
      },
      {
        role: "user",
        content: `For this text: ${prompt}. You have to rewrite the text to respect the command: ${command}. Use appropriate markdown formatting, and make sure to use <editor_content> tags for anything you want to be displayed in the article editor.`,
      },
    ])
    .with("copilot-chat", () => [
      {
        role: "system",
        content: "You are an AI chat assistant that responds to user queries. " +
          "You take an input from the user and respond accordingly, using Markdown formatting when necessary.",
      },
      {
        role: "user",
        content: `Your answer is to be based on this text: ${prompt}. You have to respond to this query: ${command}.`,
      },
    ])
    .run();

    const result = await streamText({
    prompt: messages[messages.length - 1].content,
    maxTokens: 4096,
      temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    model: openai("gpt-4o-mini"),
    });
    // console.log("Result message: ", result.text);
    return result.toDataStreamResponse();
}

```

# app/api/copilot/systemPrompt.ts

```ts
export const systemPrompt = `You are an AI writing assistant specialized in generating and editing content within the Novel editor, which is built on top of Tiptap. Your role is to help users create well-structured, rich content while leveraging the full capabilities of the editor.

Key Capabilities:

1. Content Structure and Organization:
- Use semantic HTML elements and Markdown for proper document structure
- Create clear hierarchies with headings (h1-h6)
- Organize content into logical sections with appropriate spacing
- Use descriptive headings that follow a clear hierarchy
- Implement proper content flow and transitions
- Structure content for maximum readability and engagement

2. Rich Text Features:
- **Bold text** for strong emphasis and key points
- *Italic text* for subtle emphasis or terminology
- \`Inline code\` for technical terms, commands, or short code snippets
- ~~Strikethrough~~ for showing changes or revisions
- Ordered and unordered lists for structured information
- Block quotes for important callouts or citations
- Horizontal rules (---) for clear section breaks
- Code blocks with appropriate language syntax highlighting:
\`\`\`typescript
// TypeScript example
interface User {
  id: string;
  name: string;
  email: string;
}
\`\`\`

3. Interactive Elements:
- Task lists [ ] for actionable items and todos
- Mentions @ for referencing people or resources
- Custom React components when specified
- Links [text](url) for references and resources
- Images ![alt](src) with descriptive alt text
- Tables for structured data presentation
- Custom node views for specialized content
- Collaborative editing markers
- Placeholder text for empty sections

4. Advanced Formatting:
- Tables with proper alignment and formatting:
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |

- Nested lists with proper indentation:
  1. First level
     - Sub-item A
     - Sub-item B
       1. Deeper level
       2. Another point

- Code blocks with filename headers:
\`\`\`tsx filename="components/Editor.tsx"
import { Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export default function TiptapEditor() {
  // Component implementation
}
\`\`\`

Guidelines for Content Generation:

1. Always structure your response as follows:
Helpful intro to the request that stays in the chat history
<editor_content>
[Your generated/editor content here, using appropriate markdown and HTML elements that goes to the editor]
</editor_content>
Helpful conclusion that stays in the chat history

2. When generating code examples:
- Use proper syntax highlighting with language specification
- Include all necessary imports and dependencies
- Ensure code is properly formatted and commented
- Follow TypeScript best practices when applicable
- Include error handling and edge cases
- Provide type definitions and interfaces

3. For React Components:
- Include all necessary imports from React
- Use proper TypeScript types and interfaces
- Follow React best practices and hooks guidelines
- Include required props with proper typing
- Implement proper event handling
- Add appropriate comments and documentation

4. Content Quality Standards:
- Maintain consistent tone and style throughout
- Use clear and concise language
- Include relevant examples and illustrations
- Provide proper citations when needed
- Ensure content is well-organized and scannable
- Use appropriate technical terminology


A few examples:
Start of example
This example demonstrates how to create an article about React hooks, including multiple code blocks.


User Query: Can you help me create an article about React hooks?

Assistant Response: I'd be happy to help you create an article about React hooks.

<thinking>Creating an article about React hooks is a good candidate for an editor_content. It's a substantial piece of content that can be understood on its own and is likely to be reused or modified. This is a new request, so I'll create a new editor_content.</thinking>

<editor_content>
# Understanding React Hooks in Modern Web Development

## Introduction
React Hooks revolutionized how we write functional components. Let's explore the most important hooks and their practical applications.

### useState: Managing Component State
The \`useState\` hook is fundamental for handling state in functional components:

\`\`\`typescript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState<number>(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

> **Pro Tip**: Always specify the type for useState when working with complex data structures.

### useEffect: Handling Side Effects
The \`useEffect\` hook is used to handle side effects in functional components, such as fetching data or setting timers:

\`\`\`typescript
import { useEffect, useState } from 'react';

function FetchData() {
  const [data, setData] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://api.example.com/data');
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  return (
    <div>
      <p>Data: {data}</p>
    </div>
  );
}
\`\`\`

### useContext: Accessing Context API
The \`useContext\` hook is used to access context (shared state) in functional components:

\`\`\`typescript
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function Button() {
  const theme = useContext(ThemeContext);

  return (
    <button style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      Click Me
    </button>
  );
}
\`\`\`

### Advanced Hook Patterns
Let's explore some advanced patterns...
</editor_content>Hope this expanded example helps you understand a bit more about React hooks and their applications

End of example

<example_docstring>
This example demonstrates how to write an article about documentation for a Tiptap extension.
</example_docstring>

<example>
<user_query>Can you help me create documentation for my Tiptap extension?</user_query>

<assistant_response>
Sure! I'll help you create documentation for your Tiptap extension.

<thinking>Creating documentation for a Tiptap extension is a good candidate for an editor_content. It's a substantial piece of content that can be understood on its own and is likely to be reused or modified. This is a new request, so I'll create a new editor_content.</thinking>

<editor_content>
# Custom Tiptap Extension Documentation

## Overview
This extension adds support for custom node views with interactive elements.

### Installation
\`\`\`bash
npm install @tiptap/extension-custom-node
\`\`\`

### Usage
\`\`\`typescript
import { Editor } from '@tiptap/core'
import CustomNode from './CustomNode'

new Editor({
  extensions: [
    CustomNode.configure({
      // configuration options
    })
  ]
})
\`\`\`

## API Reference

### Configuration Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| inline | boolean | false | Renders as inline element |
| HTMLAttributes | object | {} | HTML attributes |

### Commands
1. \`setCustomNode\`: Creates a new custom node
2. \`toggleCustomNode\`: Toggles the custom node state
</editor_content>
Hope this helps you understand a bit more about about Tiptap extension documentation
</assistant_response>
</example>

<example_docstring>
This example demonstrates how to write an article about the Andromeda Galaxy, including images and link references.
</example_docstring>

<example>
<user_query>Can you help me write an article about the Andromeda Galaxy that includes images and link references?</user_query>

<assistant_response>
I'd be happy to help you write an article about the Andromeda Galaxy, including images and link references.

<thinking>Writing an article about the Andromeda Galaxy is a great opportunity to create engaging content that combines scientific information with visual aids and credible sources. This is a new request, so I'll create a new editor_content.</thinking>

<editor_content>
# The Andromeda Galaxy: A Cosmic Marvel
## Introduction
The Andromeda Galaxy, also known as Messier 31 (M31) or NGC 224, is a majestic spiral galaxy located approximately 2.5 million light-years away in the constellation Andromeda. It is the largest member of the Local Group of galaxies, which includes the Milky Way, Triangulum, and several other smaller galaxies.

### Structure and Composition
The Andromeda Galaxy is a barred spiral galaxy, consisting of hundreds of billions of stars, as well as various types of interstellar gas and dust. It is estimated to be about 220,000 light-years in diameter, making it the largest nearby galaxy to our own Milky Way.

![Andromeda Galaxy Image](https://upload.wikimedia.org/wikipedia/commons/5/5b/Andromeda_Galaxy_from_Hubble_Space_Telescope.jpg)
[Image Credit: NASA, ESA, and the Hubble Heritage Team](https://www.nasa.gov/mission_pages/hubble/multimedia/pia04224.html)

### Distance and Size
The Andromeda Galaxy is approaching the Milky Way at a speed of about 250,000 miles per hour (400,000 kilometers per hour). In about 4.5 billion years, the Andromeda Galaxy will collide with the Milky Way, resulting in a spectacular cosmic merger. [1]

### Observational History
The Andromeda Galaxy has been observed by humans for centuries. The earliest recorded observation dates back to 964 AD by the Persian astronomer Abd al-Rahman al-Sufi. [2] In the 20th century, Edwin Hubble's observations of the galaxy helped establish the concept of galaxies beyond our own Milky Way.

### References
[1] NASA - HubbleSite: "Hubble Sees Galaxy Collisions in the Distant Universe" [https://hubblesite.org/news_release/news/2007-36](https://hubblesite.org/news_release/news/2007-36)
[2] Wikipedia - Andromeda Galaxy: "Observational History" [https://en.wikipedia.org/wiki/Andromeda_Galaxy#Observational_history](https://en.wikipedia.org/wiki/Andromeda_Galaxy#Observational_history)
</editor_content>
I've generated an article about the Andromeda Galaxy, please review it and let me know if you need any changes.
</assistant_response>
</example>



Remember to:
1. Always wrap the editor content in <editor_content> tags for anything you want to be displayed in the article editor
2. Use appropriate markdown syntax
3. Include necessary code imports
4. Structure content logically
5. Maintain consistent formatting
6. Provide clear examples and explanations
7. Include proper error handling
8. Add TypeScript types where appropriate
9. Follow React best practices
10. Keep code snippets focused and well-commented

For any code-related content, ensure it's:
- Properly typed with TypeScript
- Well-commented with clear explanations
- Following best practices for the relevant framework
- Properly formatted and organized
- Including all necessary imports and dependencies
- Handling errors and edge cases appropriately
- Using consistent naming conventions
- Following proper security practices
- Optimized for performance where possible

Again, always wrap the editor content in <editor_content> tags, and rest outside of it`;

```

# app/api/generate/route.ts

```ts
import { openai } from "@ai-sdk/openai";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { streamText } from "ai";
import { match } from "ts-pattern";

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
export const runtime = "edge";
console.log(process.env.OPENAI_API_KEY);
export async function POST(req: Request): Promise<Response> {
  // Check if the OPENAI_API_KEY is set, if not return 400
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "") {
    return new Response("Missing OPENAI_API_KEY - make sure to add it to your .env file.", {
      status: 400,
    });
  }
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const ip = req.headers.get("x-forwarded-for");
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(50, "1 d"),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(`novel_ratelimit_${ip}`);

    if (!success) {
      return new Response("You have reached your request limit for the day.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  }
  const { prompt, option, command } = await req.json();
  console.log("Request before sending: ", { prompt, option, command }); // Added console log for the request
  const messages = match(option)
    .with("continue", () => [
      {
        role: "system",
      content:
          "You are an AI writing assistant that continues existing text based on context from prior text. " +
          "Give more weight/priority to the later characters than the beginning ones. " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
        "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: prompt,
      },
    ])
    .with("improve", () => [
      {
        role: "system",
      content:
          "You are an AI writing assistant that improves existing text. " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
        "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("shorter", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that shortens existing text. " + "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("longer", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that lengthens existing text. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("fix", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that fixes grammar and spelling errors in existing text. " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("zap", () => [
      {
        role: "system",
        content:
          "You area an AI writing assistant that generates text based on a prompt. " +
          "You take an input from the user and a command for manipulating the text" +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `For this text: ${prompt}. You have to respect the command: ${command}`,
      },
    ])
    .with("copilot-write", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that generates text based on a prompt. " +
          "You take an input from the user and a command for rewriting the text or writing a new text. " +
          "Use rich Markdown formatting to enhance the text structure and readability. You can use: " +
          "\n- **Bold text** for emphasis" +
          "\n- *Italic text* for subtle emphasis" +
          "\n- `Code blocks` for technical terms" +
          "\n- ~~Strikethrough~~ for revisions" +
          "\n- # Headings (levels 1-6)" +
          "\n- Bullet lists" +
          "\n- Numbered lists" +
          "\n- \`\`\`language\nCode blocks with syntax highlighting\n\`\`\`" +
          "\n- [Links](https://example.com) for references" +
          "\n- ![Images](https://example.com/image.jpg) for visual content" +
          "\n- > Blockquotes for highlighting important text" +
          "\n- --- for horizontal rules to separate sections" +
          "\nMake the text engaging and well-structured using these formatting options. " +
          "When including links, ensure they are properly formatted and relevant. " +
          "For images, provide descriptive alt text. " +
          "Use blockquotes to highlight key points or quotes. " +
          "Structure the content with appropriate headings and sections.",
      },
      {
        role: "user",
        content: `For this text: ${prompt}. You have to rewrite the text to respect the command: ${command}. Use appropriate markdown formatting to enhance readability and structure, including links and embedded content where relevant.`,
      },
    ])
    .with("copilot-chat", () => [
      {
        role: "system",
        content: "You are an AI chat assistant that responds to user queries. " +
          "You take an input from the user and respond accordingly, using Markdown formatting when necessary.",
      },
      {
        role: "user",
        content: `Your answer is to be based on this text: ${prompt}. You have to respond to this query: ${command}.`,
      },
    ])
    .run();

  const result = await streamText({
    prompt: messages[messages.length - 1].content,
    maxTokens: 4096,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    model: openai("gpt-4o-mini"),
  });

  return result.toDataStreamResponse();
}

```

# app/api/upload/route.ts

```ts
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new Response("Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file.", {
      status: 401,
    });
  }

  const file = req.body || "";
  const filename = req.headers.get("x-vercel-filename") || "file.txt";
  const contentType = req.headers.get("content-type") || "text/plain";
  const fileType = `.${contentType.split("/")[1]}`;

  // construct final filename based on content-type if not provided
  const finalName = filename.includes(fileType) ? filename : `${filename}${fileType}`;
  const blob = await put(finalName, file, {
    contentType,
    access: "public",
  });

  return NextResponse.json(blob);
}

```

# app/document/[id]/page.tsx

```tsx
"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor";
import { Button } from "@/components/tailwind/ui/button";
import { ArrowLeft, Search, Plus, Trash2 } from "lucide-react";
import Copilot from "@/components/tailwind/copilot/index";
import type { JSONContent } from "novel";
import { initDB, saveDocument, getDocument, getAllDocuments, deleteDocument, type Document } from "@/lib/indexeddb";
import { defaultEditorContent } from "@/lib/content";

interface DocumentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DocumentPage({ params }: DocumentPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [showCopilot, setShowCopilot] = useState(true);
  const [content, setContent] = useState<JSONContent | undefined>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [title, setTitle] = useState("Untitled");
  const [isLoading, setIsLoading] = useState(true);
  const [editorKey, setEditorKey] = useState<number>(Date.now());

  useEffect(() => {
    const setup = async () => {
      try {
        await initDB();
        const allDocs = await getAllDocuments();
        setDocuments(allDocs);

        if (id !== 'new') {
          const doc = await getDocument(id);
          if (doc) {
            setContent(doc.content);
            setTitle(doc.title);
          } else {
            // If document doesn't exist, create it
            await saveDocument({
              id,
              title: "Untitled",
              content: defaultEditorContent,
              lastModified: Date.now(),
            });
          }
        }
      } catch (error) {
        console.error('Failed to initialize:', error);
      } finally {
        setIsLoading(false);
      }
    };
    setup();
  }, [id]);

  const handleEditorChange = async (newContent: JSONContent) => {
    setContent(newContent);
    try {
      await saveDocument({
        id,
        title,
        content: newContent,
        lastModified: Date.now(),
      });
      const allDocs = await getAllDocuments();
      setDocuments(allDocs);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleCreateNew = async () => {
    const newId = crypto.randomUUID();
    try {
      // Save an empty document first
      await saveDocument({
        id: newId,
        title: "Untitled",
        content: defaultEditorContent,
        lastModified: Date.now(),
      });
      const allDocs = await getAllDocuments();
      setDocuments(allDocs);
      router.push(`/document/${newId}`);
    } catch (error) {
      console.error('Failed to create new document:', error);
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      await deleteDocument(docId);
      const allDocs = await getAllDocuments();
      setDocuments(allDocs);
      if (docId === id) {
        router.push('/document/new');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleCopilotUpdate = (newContent: JSONContent) => {
    handleEditorChange(newContent);
    setEditorKey(Date.now()); // Force editor reload
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={async () => {
            if (content) {
              await handleEditorChange(content);
            }
          }}
          className="text-lg font-medium bg-transparent border-none focus:outline-none"
          placeholder="Untitled"
        />
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost">Upload Files</Button>
          <Button variant="ghost">Magic Export</Button>
          <Button 
            className="bg-gradient-to-r from-purple-400 to-pink-400 text-white"
            onClick={() => setShowCopilot(!showCopilot)}
          >
            Copilot
          </Button>
          <Button variant="ghost">Share</Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Document List */}
        <div className="w-64 border-r bg-background p-4 flex flex-col">
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search docs..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 mb-4"
            onClick={handleCreateNew}
          >
            <Plus className="w-4 h-4" />
            New Document
          </Button>

          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Recent Documents</h2>
              <div className="space-y-1">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`flex items-center justify-between px-2 py-1 rounded text-sm cursor-pointer ${
                      doc.id === id ? 'bg-purple-50' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => router.push(`/document/${doc.id}`)}
                  >
                    <span className={`font-medium ${doc.id === id ? 'text-purple-600' : 'text-gray-800'}`}>
                      {doc.title || 'Untitled'}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(doc.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <TailwindAdvancedEditor 
            key={editorKey}
            initialContent={content}
            onChange={handleEditorChange}
          />
        </div>

        {/* Right Sidebar - Copilot */}
        {showCopilot && (
          <Copilot
            onUpdateContent={handleCopilotUpdate}
            getCurrentContent={() => content || defaultEditorContent}
          />
        )}
      </div>
    </div>
  );
}

```

# app/favicon.ico

This is a binary file of the type: Binary

# app/layout.tsx

```tsx
import "@/styles/globals.css";
import "@/styles/prosemirror.css";
import 'katex/dist/katex.min.css';

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Providers from "./providers";

const title = "Novel - Notion-style WYSIWYG editor with AI-powered autocompletions";
const description =
  "Novel is a Notion-style WYSIWYG editor with AI-powered autocompletions. Built with Tiptap, OpenAI, and Vercel AI SDK.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: "summary_large_image",
    creator: "@steventey",
  },
  metadataBase: new URL("https://novel.sh"),
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

```

# app/opengraph-image.png

This is a binary file of the type: Image

# app/page.tsx

```tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/tailwind/ui/button";
import { FileText, Presentation, ArrowRight } from "lucide-react";

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Novel</h1>
          <p className="mt-2 text-lg text-gray-600">Your AI-powered document workspace</p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Document Generation Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:border-purple-200 transition-colors">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Generate Document</h2>
            <p className="text-gray-600 mb-8">
              Create professional documents with AI assistance. Perfect for reports, articles, and research papers.
            </p>
            <Button
              onClick={() => router.push("/document/new")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Presentation Slides Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 opacity-75">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
              <Presentation className="w-6 h-6 text-gray-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Generate Slides</h2>
            <p className="text-gray-600 mb-8">
              Transform your content into beautiful presentation slides. Coming soon!
            </p>
            <Button
              disabled
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
            >
              Coming Soon
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

```

# app/providers.tsx

```tsx
"use client";

import { type Dispatch, type ReactNode, type SetStateAction, createContext } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import useLocalStorage from "@/hooks/use-local-storage";

export const AppContext = createContext<{
  font: string;
  setFont: Dispatch<SetStateAction<string>>;
}>({
  font: "Default",
  setFont: () => {},
});

const ToasterProvider = () => {
  const { theme } = useTheme() as {
    theme: "light" | "dark" | "system";
  };
  return <Toaster theme={theme} />;
};

export default function Providers({ children }: { children: ReactNode }) {
  const [font, setFont] = useLocalStorage<string>("novel__font", "Default");

  return (
    <ThemeProvider attribute="class" enableSystem disableTransitionOnChange defaultTheme="system">
      <AppContext.Provider
        value={{
          font,
          setFont,
        }}
      >
        <ToasterProvider />
        {children}
        <Analytics />
      </AppContext.Provider>
    </ThemeProvider>
  );
}

```

# biome.json

```json
{
  "extends": ["../../biome.json"]
}

```

# components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "styles/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components/tailwind",
    "utils": "@/lib/utils"
  }
}

```

# components/tailwind/advanced-editor.tsx

```tsx
"use client";
import { defaultEditorContent } from "@/lib/content";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  ImageResizer,
  type JSONContent,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
} from "novel";
import { useEffect, useState } from "react";
import { defaultExtensions } from "./extensions";
import { ColorSelector } from "./selectors/color-selector";
import { LinkSelector } from "./selectors/link-selector";
import { MathSelector } from "./selectors/math-selector";
import { NodeSelector } from "./selectors/node-selector";
import { Separator } from "./ui/separator";

import GenerativeMenuSwitch from "./generative/generative-menu-switch";
import { uploadFn } from "./image-upload";
import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";

const hljs = require("highlight.js");

const extensions = [...defaultExtensions, slashCommand];

interface TailwindAdvancedEditorProps {
  initialContent?: JSONContent;
  onChange?: (content: JSONContent) => void;
}

const TailwindAdvancedEditor = ({ initialContent = defaultEditorContent, onChange }: TailwindAdvancedEditorProps) => {
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [charsCount, setCharsCount] = useState();

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  //Apply Codeblock Highlighting on the HTML from editor.getHTML()
  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      // @ts-ignore
      // https://highlightjs.readthedocs.io/en/latest/api.html?highlight=highlightElement#highlightelement
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  const handleUpdate = (editor: EditorInstance) => {
    const json = editor.getJSON();
    setCharsCount(editor.storage.characterCount.words());
    setSaveStatus("Saved");
    onChange?.(json);
  };

  return (
    <div className="relative w-full max-w-screen-lg">
      <div className="flex absolute right-5 top-5 z-10 mb-5 gap-2">
        <div className="rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">{saveStatus}</div>
        <div className={charsCount ? "rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground" : "hidden"}>
          {charsCount} Words
        </div>
      </div>
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          className="relative min-h-[500px] w-full max-w-screen-lg border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
            },
          }}
          onUpdate={({ editor }) => {
            handleUpdate(editor);
            setSaveStatus("Unsaved");
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">No results</EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <MathSelector />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </GenerativeMenuSwitch>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default TailwindAdvancedEditor;

```

# components/tailwind/copilot/index.tsx

```tsx
import React from 'react';
import { Plus, RotateCcw, ArrowUpCircle, Search, AtSign, Mic, Check, X, PencilLine } from 'lucide-react';
import { useCopilot, type ExtendedMessage } from './use-copilot';
import type { CopilotProps } from './types';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

// Helper to format message content with editor content highlighted
const formatMessageContent = (message: ExtendedMessage) => {
  if (!message.content) return null;

  const startTag = "<editor_content>";
  const endTag = "</editor_content>";
  const parts = [];
  let currentIndex = 0;

  // Find all editor content sections
  while (true) {
    const startIndex = message.content.indexOf(startTag, currentIndex);
    if (startIndex === -1) {
      // Add remaining text
      if (currentIndex < message.content.length) {
        parts.push({
          type: 'text',
          content: message.content.slice(currentIndex)
        });
      }
      break;
    }

    // Add text before editor content
    if (startIndex > currentIndex) {
      parts.push({
        type: 'text',
        content: message.content.slice(currentIndex, startIndex)
      });
    }

    const endIndex = message.content.indexOf(endTag, startIndex);
    if (endIndex === -1) break;

    // Add editor content
    parts.push({
      type: 'editor',
      content: message.content.slice(startIndex + startTag.length, endIndex)
    });

    currentIndex = endIndex + endTag.length;
  }

  return parts;
};

const Copilot = ({ onUpdateContent, getCurrentContent }: CopilotProps) => {
  const {
    mode,
    setMode,
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    handleSuggestionApply,
  } = useCopilot(onUpdateContent, getCurrentContent);

  return (
    <div className="w-96 border-l flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-medium">C</span>
          </div>
          <span className="font-medium text-foreground">Copilot</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-accent rounded-lg">
            <Plus className="w-4 h-4 text-foreground" />
          </button>
          <button className="p-2 hover:bg-accent rounded-lg">
            <RotateCcw className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {messages.length === 0 ? (
            <>
              {/* Welcome Message */}
              <div>
                <h2 className="text-xl text-purple-600 font-medium mb-1">Hello</h2>
                <h3 className="text-2xl font-semibold text-foreground">What are we working on today?</h3>
              </div>

              {/* Mode Indicator */}
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                    {mode === 'write' ? '✍️ Write mode' : '💬 Chat mode'}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {mode === 'write'
                    ? 'Copilot can directly edit and work on your canvas.'
                    : 'Chat with Copilot and approve suggestions before applying them.'}
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {messages.map((message: ExtendedMessage) => (
                <div
                  key={message.id}
                  className={cn(
                    'p-4 rounded-lg',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-8'
                      : 'bg-muted text-foreground mr-8'
                  )}
                >
                  <div className="text-sm mb-1 text-muted-foreground">
                    {message.role === 'user' ? 'You' : 'Copilot'}:
                  </div>
                  <div className="text-foreground">
                    {formatMessageContent(message)?.map((part, index) => (
                      part.type === 'editor' ? (
                        <div key={index} className="my-2 p-3 bg-background border-l-4 border-primary rounded">
                          <div className="flex items-center gap-2 text-sm text-purple-600 mb-2">
                            <PencilLine className="h-4 w-4" />
                            <span className="font-medium">Editor Content:</span>
                          </div>
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown>{part.content}</ReactMarkdown>
                          </div>
                        </div>
                      ) : (
                        <span key={index}>{part.content}</span>
                      )
                    ))}
                  </div>
                  {mode === 'chat' && message.role === 'assistant' && message.suggestion && (
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleSuggestionApply(message.suggestion!)}
                        className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium flex items-center gap-1 hover:bg-purple-200"
                      >
                        <Check className="h-4 w-4" />
                        Apply to Editor
                      </button>
                      <button className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium flex items-center gap-1 hover:bg-accent/80">
                        <X className="h-4 w-4" />
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="bg-muted mr-8 p-4 rounded-lg animate-pulse">
                  <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setMode('write')}
            className={cn(
              'px-3 py-1 text-sm rounded-full flex items-center gap-1',
              mode === 'write'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent'
            )}
          >
            <span>Write</span>
          </button>
          <button
            onClick={() => setMode('chat')}
            className={cn(
              'px-3 py-1 text-sm rounded-full flex items-center gap-1',
              mode === 'chat'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent'
            )}
          >
            <span>Chat</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me to do anything..."
            className="w-full p-3 pr-24 border rounded-lg resize-none h-[45px] focus:outline-none focus:ring-2 focus:ring-purple-400 bg-background text-foreground"
            rows={1}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <button type="submit" className="p-1 hover:bg-accent rounded" disabled={isLoading}>
              <ArrowUpCircle className={cn("w-5 h-5", isLoading ? "text-muted-foreground/40" : "text-muted-foreground")} />
            </button>
            <button type="button" className="p-1 hover:bg-accent rounded">
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
            <button type="button" className="p-1 hover:bg-accent rounded">
              <AtSign className="w-5 h-5 text-muted-foreground" />
            </button>
            <button type="button" className="p-1 hover:bg-accent rounded">
              <Mic className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </form>

        {/* Model Selection */}
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <button className="flex items-center gap-1 hover:bg-accent px-2 py-1 rounded">
            <span>↑</span>
            <span>GPT-4</span>
          </button>
          <button className="flex items-center gap-1 hover:bg-accent px-2 py-1 rounded">
            <Search className="w-4 h-4" />
            <span>Web Search</span>
          </button>
          <button className="hover:bg-accent px-2 py-1 rounded">
            <AtSign className="w-4 h-4" />
          </button>
          <button className="hover:bg-accent px-2 py-1 rounded">
            <span>0</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Copilot; 
```

# components/tailwind/copilot/types.ts

```ts
import type { JSONContent } from "novel";

export type CopilotMode = "write" | "chat";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  pending?: boolean;
  suggestion?: JSONContent | null;
}

export interface CopilotProps {
  onUpdateContent: (content: JSONContent) => void;
  getCurrentContent: () => JSONContent;
} 
```

# components/tailwind/copilot/use-copilot.ts

```ts
import { useChat } from 'ai/react';
import { useState } from 'react';
import type { CopilotMode, Message } from './types';
import type { JSONContent } from 'novel';
import type { ChangeEvent } from 'react';

// Create a new interface that extends Message but adds our own properties
export interface ExtendedMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  suggestion?: string;
  editorContent?: string; // Add this to store the extracted editor content
}

// Helper function to extract content between editor_content tags
const extractEditorContent = (text: string): { editorContent: string | null; fullContent: string } => {
  const startTag = "<editor_content>";
  const endTag = "</editor_content>";
  
  const startIndex = text.indexOf(startTag);
  const endIndex = text.indexOf(endTag);
  
  if (startIndex === -1 || endIndex === -1) {
    return { editorContent: null, fullContent: text };
  }
  
  const editorContent = text.slice(startIndex + startTag.length, endIndex).trim();
  return { 
    editorContent,
    fullContent: text 
  };
};

// Helper function to parse markdown into JSONContent
const parseMarkdownToContent = (markdown: string): JSONContent => {
  console.log('Parsing markdown:', markdown);
  const content: JSONContent['content'] = [];
  
  const lines = markdown.split('\n');
  let currentList: any[] = [];
  let inCodeBlock = false;
  let codeBlockContent = '';
  let codeBlockLanguage = '';
  
  // Helper to parse inline content with links and formatting
  const parseInlineContent = (text: string) => {
    const parts = [];
    let currentIndex = 0;
    
    // Match links [text](url), inline code, bold, italic, strike, and images ![alt](url)
    const pattern = /(!?\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*|`.*?`|~~.*?~~)/g;
    let match;
    
    while ((match = pattern.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        parts.push({
          type: 'text',
          text: text.slice(currentIndex, match.index)
        });
      }
      
      const token = match[0];
      if (token.startsWith('![')) {
        // Image
        const [alt, url] = parseLink(token.slice(1));
        parts.push({
          type: 'image',
          attrs: { src: url, alt: alt || '', title: alt || '' }
        });
      } else if (token.startsWith('[')) {
        // Link
        const [text, url] = parseLink(token);
        parts.push({
          type: 'text',
          marks: [{ type: 'link', attrs: { href: url } }],
          text: text
        });
      } else if (token.startsWith('**')) {
        // Bold
        parts.push({
          type: 'text',
          marks: [{ type: 'bold' }],
          text: token.slice(2, -2)
        });
      } else if (token.startsWith('*')) {
        // Italic
        parts.push({
          type: 'text',
          marks: [{ type: 'italic' }],
          text: token.slice(1, -1)
        });
      } else if (token.startsWith('`')) {
        // Code
        parts.push({
          type: 'text',
          marks: [{ type: 'code' }],
          text: token.slice(1, -1)
        });
      } else if (token.startsWith('~~')) {
        // Strike
        parts.push({
          type: 'text',
          marks: [{ type: 'strike' }],
          text: token.slice(2, -2)
        });
      }
      
      currentIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (currentIndex < text.length) {
      parts.push({
        type: 'text',
        text: text.slice(currentIndex)
      });
    }
    
    return parts;
  };
  
  // Helper to parse [text](url) format
  const parseLink = (token: string): [string, string] => {
    const textMatch = token.match(/\[(.*?)\]/);
    const urlMatch = token.match(/\((.*?)\)/);
    return [
      textMatch ? textMatch[1] : '',
      urlMatch ? urlMatch[1] : ''
    ];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Code block handling
    if (line.startsWith('\`\`\`')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockLanguage = line.slice(3).trim();
        continue;
      } else {
        inCodeBlock = false;
        content.push({
          type: 'codeBlock',
          attrs: { language: codeBlockLanguage || 'plain' },
          content: [{ type: 'text', text: codeBlockContent.trim() }]
        });
        codeBlockContent = '';
        continue;
      }
    }
    
    if (inCodeBlock) {
      codeBlockContent += line + '\n';
      continue;
    }

    // Handle different line types
    if (line.trim() === '') {
      continue;
    } else if (line.startsWith('#')) {
      const level = line.match(/^#+/)[0].length;
      const text = line.slice(level).trim();
      content.push({
        type: 'heading',
        attrs: { level },
        content: parseInlineContent(text)
      });
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const text = line.slice(2).trim();
      currentList.push({
        type: 'listItem',
        content: [{
          type: 'paragraph',
          content: parseInlineContent(text)
        }]
      });
    } else if (line.match(/^\d+\. /)) {
      const text = line.replace(/^\d+\. /, '').trim();
      currentList.push({
        type: 'listItem',
        content: [{
          type: 'paragraph',
          content: parseInlineContent(text)
        }]
      });
    } else if (line.startsWith('> ')) {
      // Blockquote
      const text = line.slice(2).trim();
      content.push({
        type: 'blockquote',
        content: [{
          type: 'paragraph',
          content: parseInlineContent(text)
        }]
      });
    } else if (line.startsWith('---')) {
      // Horizontal rule
      content.push({ type: 'horizontalRule' });
    } else if (line.match(/^!\[.*?\]\(.*?\)/)) {
      // Standalone image
      const [alt, url] = parseLink(line);
      content.push({
        type: 'image',
        attrs: { src: url, alt: alt || '', title: alt || '' }
      });
    } else {
      content.push({
        type: 'paragraph',
        content: parseInlineContent(line)
      });
    }
  }

  // Add any remaining list items
  if (currentList.length > 0) {
    content.push({
      type: 'bulletList',
      content: currentList
    });
    currentList = [];
  }

  console.log('Parsed content:', { type: 'doc', content });
  return { type: 'doc', content };
};

// Helper function to serialize editor content to markdown
const serializeContent = (content: JSONContent): string => {
  console.log('Serializing content:', content);
  let markdown = '';
  
  const serializeMarks = (text: string, marks: any[] = []) => {
    return marks.reduce((t, mark) => {
      switch (mark.type) {
        case 'bold':
          return `**${t}**`;
        case 'italic':
          return `*${t}*`;
        case 'code':
          return `\`${t}\``;
        case 'strike':
          return `~~${t}~~`;
        case 'link':
          return `[${t}](${mark.attrs.href})`;
        default:
          return t;
      }
    }, text);
  };
  
  content.content?.forEach(node => {
    switch (node.type) {
      case 'paragraph':
        const text = node.content?.map(c => {
          if (c.type === 'image') {
            return `![${c.attrs?.alt || ''}](${c.attrs?.src || ''})`;
          }
          return serializeMarks(c.text || '', c.marks);
        }).join('') || '';
        markdown += text + '\n\n';
        break;
      case 'heading':
        const level = node.attrs?.level || 1;
        const headingText = node.content?.map(c => serializeMarks(c.text || '', c.marks)).join('') || '';
        markdown += '#'.repeat(level) + ' ' + headingText + '\n\n';
        break;
      case 'bulletList':
        node.content?.forEach(item => {
          const itemText = item.content?.[0].content?.map(c => serializeMarks(c.text || '', c.marks)).join('') || '';
          markdown += `- ${itemText}\n`;
        });
        markdown += '\n';
        break;
      case 'orderedList':
        node.content?.forEach((item, index) => {
          const itemText = item.content?.[0].content?.map(c => serializeMarks(c.text || '', c.marks)).join('') || '';
          markdown += `${index + 1}. ${itemText}\n`;
        });
        markdown += '\n';
        break;
      case 'codeBlock':
        const language = node.attrs?.language || '';
        const code = node.content?.[0].text || '';
        markdown += '\`\`\`' + language + '\n' + code + '\n\`\`\`\n\n';
        break;
      case 'blockquote':
        const quote = node.content?.map(p => 
          p.content?.map(c => serializeMarks(c.text || '', c.marks)).join('')
        ).join('\n') || '';
        markdown += '> ' + quote + '\n\n';
        break;
      case 'horizontalRule':
        markdown += '---\n\n';
        break;
      case 'image':
        markdown += `![${node.attrs?.alt || ''}](${node.attrs?.src || ''})\n\n`;
        break;
    }
  });

  console.log('Serialized to markdown:', markdown);
  return markdown.trim();
};

export function useCopilot(
  onUpdateContent: (content: JSONContent) => void,
  getCurrentContent: () => JSONContent
) {
  const [mode, setMode] = useState<CopilotMode>('write');
  const [command, setCommand] = useState('');
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());
  
  const handleSuggestionApply = (suggestion: string) => {
    // Extract editor content if available
    const { editorContent } = extractEditorContent(suggestion);
    const contentToApply = editorContent || suggestion;
  
    const content = parseMarkdownToContent(contentToApply);
    onUpdateContent(content);
    setLastUpdateTime(Date.now());
};

  const {
    messages: rawMessages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading,
  } = useChat({
    api: '/api/copilot',
    body: {
      option: mode === 'write' ? 'copilot-write' : 'copilot-chat',
      prompt: serializeContent(getCurrentContent()),
      command: command,
    },
    onFinish: (message) => {
      console.log('Received API response:', message);

      // Extract content and store both full and editor content
      const { editorContent, fullContent } = extractEditorContent(message.content);
      const extendedMessage = message as ExtendedMessage;
      extendedMessage.content = fullContent;
      extendedMessage.editorContent = editorContent;

      if (mode === 'write' && editorContent) {
  try {
          const content = parseMarkdownToContent(editorContent);
          console.log('Updating editor with content:', content);
          onUpdateContent(content);
          setLastUpdateTime(Date.now());
        } catch (error) {
          console.error('Failed to parse markdown content:', error);
          // Fallback to simple paragraph if parsing fails
          onUpdateContent({
            type: 'doc',
            content: [{
              type: 'paragraph',
              content: [{ type: 'text', text: editorContent }]
            }]
          });
  }
      } else if (mode === 'write' && !editorContent) {
        // If no editor content tags found, use the full content
        try {
          const content = parseMarkdownToContent(fullContent);
          console.log('Updating editor with full content:', content);
          onUpdateContent(content);
          setLastUpdateTime(Date.now());
        } catch (error) {
          console.error('Failed to parse markdown content:', error);
          onUpdateContent({
            type: 'doc',
            content: [{
              type: 'paragraph',
              content: [{ type: 'text', text: fullContent }]
            }]
          });
      }
      } else {
        // In chat mode, store both the full message and editor content
        extendedMessage.suggestion = editorContent || fullContent;
    }
    },
  });

  // Update command when input changes
  const handleCommandChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    setCommand(e.target.value);
    handleInputChange(e);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    
    console.log(`Submitting in ${mode} mode with command:`, command);
    const currentContent = getCurrentContent();
    console.log('Current content:', currentContent);
    await originalHandleSubmit(e);
  };

  return {
    mode,
    setMode,
    messages: rawMessages as ExtendedMessage[],
    input,
    handleInputChange: handleCommandChange,
    handleSubmit,
    isLoading,
    handleSuggestionApply,
    lastUpdateTime,
  };
} 

```

# components/tailwind/extensions.ts

```ts
import {
  AIHighlight,
  CharacterCount,
  CodeBlockLowlight,
  Color,
  CustomKeymap,
  GlobalDragHandle,
  HighlightExtension,
  HorizontalRule,
  // MarkdownExtension,
  Mathematics,
  Placeholder,
  StarterKit,
  TaskItem,
  TaskList,
  TextStyle,
  TiptapImage,
  TiptapLink,
  TiptapUnderline,
  Twitter,
  UpdatedImage,
  UploadImagesPlugin,
  Youtube,
} from "novel";

import { cx } from "class-variance-authority";
import { common, createLowlight } from "lowlight";

//TODO I am using cx here to get tailwind autocomplete working, idk if someone else can write a regex to just capture the class key in objects
const aiHighlight = AIHighlight;
//You can overwrite the placeholder with your own configuration
const placeholder = Placeholder;
const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cx(
      "text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer",
    ),
  },
});

const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: cx("opacity-40 rounded-lg border border-stone-200"),
      }),
    ];
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted"),
  },
});

const updatedImage = UpdatedImage.configure({
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted"),
  },
});

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cx("not-prose pl-2 "),
  },
});
const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx("flex gap-2 items-start my-4"),
  },
  nested: true,
});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cx("mt-4 mb-6 border-t border-muted-foreground"),
  },
});

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cx("list-disc list-outside leading-3 -mt-2"),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cx("list-decimal list-outside leading-3 -mt-2"),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cx("leading-normal -mb-2"),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cx("border-l-4 border-primary"),
    },
  },
  codeBlock: {
    HTMLAttributes: {
      class: cx("rounded-md bg-muted text-muted-foreground border p-5 font-mono font-medium"),
    },
  },
  code: {
    HTMLAttributes: {
      class: cx("rounded-md bg-muted  px-1.5 py-1 font-mono font-medium"),
      spellcheck: "false",
    },
  },
  horizontalRule: false,
  dropcursor: {
    color: "#DBEAFE",
    width: 4,
  },
  gapcursor: false,
});

const codeBlockLowlight = CodeBlockLowlight.configure({
  // configure lowlight: common /  all / use highlightJS in case there is a need to specify certain language grammars only
  // common: covers 37 language grammars which should be good enough in most cases
  lowlight: createLowlight(common),
});

const youtube = Youtube.configure({
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted"),
  },
  inline: false,
});

const twitter = Twitter.configure({
  HTMLAttributes: {
    class: cx("not-prose"),
  },
  inline: false,
});

const mathematics = Mathematics.configure({
  HTMLAttributes: {
    class: cx("text-foreground rounded p-1 hover:bg-accent cursor-pointer"),
  },
  katexOptions: {
    throwOnError: false,
  },
});

const characterCount = CharacterCount.configure();

// const markdownExtension = MarkdownExtension.configure({
//   html: true,
//   tightLists: true,
//   tightListClass: "tight",
//   bulletListMarker: "-",
//   linkify: false,
//   breaks: false,
//   transformPastedText: false,
//   transformCopiedText: false,
// });

export const defaultExtensions = [
  starterKit,
  placeholder,
  tiptapLink,
  tiptapImage,
  updatedImage,
  taskList,
  taskItem,
  horizontalRule,
  aiHighlight,
  codeBlockLowlight,
  youtube,
  twitter,
  mathematics,
  characterCount,
  TiptapUnderline,
  // markdownExtension,
  HighlightExtension,
  TextStyle,
  Color,
  CustomKeymap,
  GlobalDragHandle,
];

```

# components/tailwind/generative/ai-completion-command.tsx

```tsx
import { CommandGroup, CommandItem, CommandSeparator } from "../ui/command";
import { useEditor } from "novel";
import { Check, TextQuote, TrashIcon } from "lucide-react";

const AICompletionCommands = ({
  completion,
  onDiscard,
}: {
  completion: string;
  onDiscard: () => void;
}) => {
  const { editor } = useEditor();
  return (
    <>
      <CommandGroup>
        <CommandItem
          className="gap-2 px-4"
          value="replace"
          onSelect={() => {
            const selection = editor.view.state.selection;

            editor
              .chain()
              .focus()
              .insertContentAt(
                {
                  from: selection.from,
                  to: selection.to,
                },
                completion,
              )
              .run();
          }}
        >
          <Check className="h-4 w-4 text-muted-foreground" />
          Replace selection
        </CommandItem>
        <CommandItem
          className="gap-2 px-4"
          value="insert"
          onSelect={() => {
            const selection = editor.view.state.selection;
            editor
              .chain()
              .focus()
              .insertContentAt(selection.to + 1, completion)
              .run();
          }}
        >
          <TextQuote className="h-4 w-4 text-muted-foreground" />
          Insert below
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />

      <CommandGroup>
        <CommandItem onSelect={onDiscard} value="thrash" className="gap-2 px-4">
          <TrashIcon className="h-4 w-4 text-muted-foreground" />
          Discard
        </CommandItem>
      </CommandGroup>
    </>
  );
};

export default AICompletionCommands;

```

# components/tailwind/generative/ai-selector-commands.tsx

```tsx
import { ArrowDownWideNarrow, CheckCheck, RefreshCcwDot, StepForward, WrapText } from "lucide-react";
import { getPrevText, useEditor } from "novel";
import { CommandGroup, CommandItem, CommandSeparator } from "../ui/command";

const options = [
  {
    value: "improve",
    label: "Improve writing",
    icon: RefreshCcwDot,
  },
  {
    value: "fix",
    label: "Fix grammar",
    icon: CheckCheck,
  },
  {
    value: "shorter",
    label: "Make shorter",
    icon: ArrowDownWideNarrow,
  },
  {
    value: "longer",
    label: "Make longer",
    icon: WrapText,
  },
];

interface AISelectorCommandsProps {
  onSelect: (value: string, option: string) => void;
}

const AISelectorCommands = ({ onSelect }: AISelectorCommandsProps) => {
  const { editor } = useEditor();

  return (
    <>
      <CommandGroup heading="Edit or review selection">
        {options.map((option) => (
          <CommandItem
            onSelect={(value) => {
              const slice = editor.state.selection.content();
              const text = editor.storage.markdown.serializer.serialize(slice.content);
              onSelect(text, value);
            }}
            className="flex gap-2 px-4"
            key={option.value}
            value={option.value}
          >
            <option.icon className="h-4 w-4 text-purple-500" />
            {option.label}
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Use AI to do more">
        <CommandItem
          onSelect={() => {
            const pos = editor.state.selection.from;
            const text = getPrevText(editor, pos);
            onSelect(text, "continue");
          }}
          value="continue"
          className="gap-2 px-4"
        >
          <StepForward className="h-4 w-4 text-purple-500" />
          Continue writing
        </CommandItem>
      </CommandGroup>
    </>
  );
};

export default AISelectorCommands;

```

# components/tailwind/generative/ai-selector.tsx

```tsx
"use client";

import { Command, CommandInput } from "@/components/tailwind/ui/command";

import { useCompletion } from "ai/react";
import { ArrowUp } from "lucide-react";
import { useEditor } from "novel";
import { addAIHighlight } from "novel";
import { useState } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";
import { Button } from "../ui/button";
import CrazySpinner from "../ui/icons/crazy-spinner";
import Magic from "../ui/icons/magic";
import { ScrollArea } from "../ui/scroll-area";
import AICompletionCommands from "./ai-completion-command";
import AISelectorCommands from "./ai-selector-commands";
//TODO: I think it makes more sense to create a custom Tiptap extension for this functionality https://tiptap.dev/docs/editor/ai/introduction

interface AISelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AISelector({ onOpenChange }: AISelectorProps) {
  const { editor } = useEditor();
  const [inputValue, setInputValue] = useState("");

  const { completion, complete, isLoading } = useCompletion({
    // id: "novel",
    api: "/api/generate",
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        return;
      }
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const hasCompletion = completion.length > 0;

  return (
    <Command className="w-[350px]">
      {hasCompletion && (
        <div className="flex max-h-[400px]">
          <ScrollArea>
            <div className="prose p-2 px-4 prose-sm">
              <Markdown>{completion}</Markdown>
            </div>
          </ScrollArea>
        </div>
      )}

      {isLoading && (
        <div className="flex h-12 w-full items-center px-4 text-sm font-medium text-muted-foreground text-purple-500">
          <Magic className="mr-2 h-4 w-4 shrink-0  " />
          AI is thinking
          <div className="ml-2 mt-1">
            <CrazySpinner />
          </div>
        </div>
      )}
      {!isLoading && (
        <>
          <div className="relative">
            <CommandInput
              value={inputValue}
              onValueChange={setInputValue}
              autoFocus
              placeholder={hasCompletion ? "Tell AI what to do next" : "Ask AI to edit or generate..."}
              onFocus={() => addAIHighlight(editor)}
            />
            <Button
              size="icon"
              className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-purple-500 hover:bg-purple-900"
              onClick={() => {
                if (completion)
                  return complete(completion, {
                    body: { option: "zap", command: inputValue },
                  }).then(() => setInputValue(""));

                const slice = editor.state.selection.content();
                const text = editor.storage.markdown.serializer.serialize(slice.content);

                complete(text, {
                  body: { option: "zap", command: inputValue },
                }).then(() => setInputValue(""));
              }}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
          {hasCompletion ? (
            <AICompletionCommands
              onDiscard={() => {
                editor.chain().unsetHighlight().focus().run();
                onOpenChange(false);
              }}
              completion={completion}
            />
          ) : (
            <AISelectorCommands onSelect={(value, option) => complete(value, { body: { option } })} />
          )}
        </>
      )}
    </Command>
  );
}

```

# components/tailwind/generative/generative-menu-switch.tsx

```tsx
import { EditorBubble, removeAIHighlight, useEditor } from "novel";
import { Fragment, type ReactNode, useEffect } from "react";
import { Button } from "../ui/button";
import Magic from "../ui/icons/magic";
import { AISelector } from "./ai-selector";

interface GenerativeMenuSwitchProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const GenerativeMenuSwitch = ({ children, open, onOpenChange }: GenerativeMenuSwitchProps) => {
  const { editor } = useEditor();

  useEffect(() => {
    if (!open) removeAIHighlight(editor);
  }, [open]);
  return (
    <EditorBubble
      tippyOptions={{
        placement: open ? "bottom-start" : "top",
        onHidden: () => {
          onOpenChange(false);
          editor.chain().unsetHighlight().run();
        },
      }}
      className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
    >
      {open && <AISelector open={open} onOpenChange={onOpenChange} />}
      {!open && (
        <Fragment>
          <Button
            className="gap-1 rounded-none text-purple-500"
            variant="ghost"
            onClick={() => onOpenChange(true)}
            size="sm"
          >
            <Magic className="h-5 w-5" />
            Ask AI
          </Button>
          {children}
        </Fragment>
      )}
    </EditorBubble>
  );
};

export default GenerativeMenuSwitch;

```

# components/tailwind/image-upload.ts

```ts
import { createImageUpload } from "novel";
import { toast } from "sonner";

const onUpload = (file: File) => {
  const promise = fetch("/api/upload", {
    method: "POST",
    headers: {
      "content-type": file?.type || "application/octet-stream",
      "x-vercel-filename": file?.name || "image.png",
    },
    body: file,
  });

  return new Promise((resolve, reject) => {
    toast.promise(
      promise.then(async (res) => {
        // Successfully uploaded image
        if (res.status === 200) {
          const { url } = (await res.json()) as { url: string };
          // preload the image
          const image = new Image();
          image.src = url;
          image.onload = () => {
            resolve(url);
          };
          // No blob store configured
        } else if (res.status === 401) {
          resolve(file);
          throw new Error("`BLOB_READ_WRITE_TOKEN` environment variable not found, reading image locally instead.");
          // Unknown error
        } else {
          throw new Error("Error uploading image. Please try again.");
        }
      }),
      {
        loading: "Uploading image...",
        success: "Image uploaded successfully.",
        error: (e) => {
          reject(e);
          return e.message;
        },
      },
    );
  });
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      toast.error("File type not supported.");
      return false;
    }
    if (file.size / 1024 / 1024 > 20) {
      toast.error("File size too big (max 20MB).");
      return false;
    }
    return true;
  },
});

```

# components/tailwind/selectors/color-selector.tsx

```tsx
import { Check, ChevronDown } from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";

import { Button } from "@/components/tailwind/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/tailwind/ui/popover";
export interface BubbleColorMenuItem {
  name: string;
  color: string;
}

const TEXT_COLORS: BubbleColorMenuItem[] = [
  {
    name: "Default",
    color: "var(--novel-black)",
  },
  {
    name: "Purple",
    color: "#9333EA",
  },
  {
    name: "Red",
    color: "#E00000",
  },
  {
    name: "Yellow",
    color: "#EAB308",
  },
  {
    name: "Blue",
    color: "#2563EB",
  },
  {
    name: "Green",
    color: "#008A00",
  },
  {
    name: "Orange",
    color: "#FFA500",
  },
  {
    name: "Pink",
    color: "#BA4081",
  },
  {
    name: "Gray",
    color: "#A8A29E",
  },
];

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
  {
    name: "Default",
    color: "var(--novel-highlight-default)",
  },
  {
    name: "Purple",
    color: "var(--novel-highlight-purple)",
  },
  {
    name: "Red",
    color: "var(--novel-highlight-red)",
  },
  {
    name: "Yellow",
    color: "var(--novel-highlight-yellow)",
  },
  {
    name: "Blue",
    color: "var(--novel-highlight-blue)",
  },
  {
    name: "Green",
    color: "var(--novel-highlight-green)",
  },
  {
    name: "Orange",
    color: "var(--novel-highlight-orange)",
  },
  {
    name: "Pink",
    color: "var(--novel-highlight-pink)",
  },
  {
    name: "Gray",
    color: "var(--novel-highlight-gray)",
  },
];

interface ColorSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ColorSelector = ({ open, onOpenChange }: ColorSelectorProps) => {
  const { editor } = useEditor();

  if (!editor) return null;
  const activeColorItem = TEXT_COLORS.find(({ color }) => editor.isActive("textStyle", { color }));

  const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) => editor.isActive("highlight", { color }));

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button size="sm" className="gap-2 rounded-none" variant="ghost">
          <span
            className="rounded-sm px-1"
            style={{
              color: activeColorItem?.color,
              backgroundColor: activeHighlightItem?.color,
            }}
          >
            A
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        sideOffset={5}
        className="my-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl "
        align="start"
      >
        <div className="flex flex-col">
          <div className="my-1 px-2 text-sm font-semibold text-muted-foreground">Color</div>
          {TEXT_COLORS.map(({ name, color }) => (
            <EditorBubbleItem
              key={name}
              onSelect={() => {
                editor.commands.unsetColor();
                name !== "Default" &&
                  editor
                    .chain()
                    .focus()
                    .setColor(color || "")
                    .run();
                onOpenChange(false);
              }}
              className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <div className="rounded-sm border px-2 py-px font-medium" style={{ color }}>
                  A
                </div>
                <span>{name}</span>
              </div>
            </EditorBubbleItem>
          ))}
        </div>
        <div>
          <div className="my-1 px-2 text-sm font-semibold text-muted-foreground">Background</div>
          {HIGHLIGHT_COLORS.map(({ name, color }) => (
            <EditorBubbleItem
              key={name}
              onSelect={() => {
                editor.commands.unsetHighlight();
                name !== "Default" && editor.chain().focus().setHighlight({ color }).run();
                onOpenChange(false);
              }}
              className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <div className="rounded-sm border px-2 py-px font-medium" style={{ backgroundColor: color }}>
                  A
                </div>
                <span>{name}</span>
              </div>
              {editor.isActive("highlight", { color }) && <Check className="h-4 w-4" />}
            </EditorBubbleItem>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

```

# components/tailwind/selectors/link-selector.tsx

```tsx
import { Button } from "@/components/tailwind/ui/button";
import { PopoverContent } from "@/components/tailwind/ui/popover";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { Check, Trash } from "lucide-react";
import { useEditor } from "novel";
import { useEffect, useRef } from "react";

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (_e) {
    return false;
  }
}
export function getUrlFromString(str: string) {
  if (isValidUrl(str)) return str;
  try {
    if (str.includes(".") && !str.includes(" ")) {
      return new URL(`https://${str}`).toString();
    }
  } catch (_e) {
    return null;
  }
}
interface LinkSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LinkSelector = ({ open, onOpenChange }: LinkSelectorProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { editor } = useEditor();

  // Autofocus on input by default
  useEffect(() => {
    inputRef.current?.focus();
  });
  if (!editor) return null;

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost" className="gap-2 rounded-none border-none">
          <p className="text-base">↗</p>
          <p
            className={cn("underline decoration-stone-400 underline-offset-4", {
              "text-blue-500": editor.isActive("link"),
            })}
          >
            Link
          </p>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-60 p-0" sideOffset={10}>
        <form
          onSubmit={(e) => {
            const target = e.currentTarget as HTMLFormElement;
            e.preventDefault();
            const input = target[0] as HTMLInputElement;
            const url = getUrlFromString(input.value);
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
              onOpenChange(false);
            }
          }}
          className="flex  p-1 "
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Paste a link"
            className="flex-1 bg-background p-1 text-sm outline-none"
            defaultValue={editor.getAttributes("link").href || ""}
          />
          {editor.getAttributes("link").href ? (
            <Button
              size="icon"
              variant="outline"
              type="button"
              className="flex h-8 items-center rounded-sm p-1 text-red-600 transition-all hover:bg-red-100 dark:hover:bg-red-800"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                inputRef.current.value = "";
                onOpenChange(false);
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          ) : (
            <Button size="icon" className="h-8">
              <Check className="h-4 w-4" />
            </Button>
          )}
        </form>
      </PopoverContent>
    </Popover>
  );
};

```

# components/tailwind/selectors/math-selector.tsx

```tsx
import { Button } from "@/components/tailwind/ui/button";
import { cn } from "@/lib/utils";
import { SigmaIcon } from "lucide-react";
import { useEditor } from "novel";

export const MathSelector = () => {
  const { editor } = useEditor();

  if (!editor) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="rounded-none w-12"
      onClick={(evt) => {
        if (editor.isActive("math")) {
          editor.chain().focus().unsetLatex().run();
        } else {
          const { from, to } = editor.state.selection;
          const latex = editor.state.doc.textBetween(from, to);

          if (!latex) return;

          editor.chain().focus().setLatex({ latex }).run();
        }
      }}
    >
      <SigmaIcon
        className={cn("size-4", { "text-blue-500": editor.isActive("math") })}
        strokeWidth={2.3}
      />
    </Button>
  );
};

```

# components/tailwind/selectors/node-selector.tsx

```tsx
import {
  Check,
  CheckSquare,
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  type LucideIcon,
  TextIcon,
  TextQuote,
} from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";

import { Button } from "@/components/tailwind/ui/button";
import { PopoverContent, PopoverTrigger } from "@/components/tailwind/ui/popover";
import { Popover } from "@radix-ui/react-popover";

export type SelectorItem = {
  name: string;
  icon: LucideIcon;
  command: (editor: ReturnType<typeof useEditor>["editor"]) => void;
  isActive: (editor: ReturnType<typeof useEditor>["editor"]) => boolean;
};

const items: SelectorItem[] = [
  {
    name: "Text",
    icon: TextIcon,
    command: (editor) => editor.chain().focus().clearNodes().run(),
    // I feel like there has to be a more efficient way to do this – feel free to PR if you know how!
    isActive: (editor) =>
      editor.isActive("paragraph") && !editor.isActive("bulletList") && !editor.isActive("orderedList"),
  },
  {
    name: "Heading 1",
    icon: Heading1,
    command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 1 }),
  },
  {
    name: "Heading 2",
    icon: Heading2,
    command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 2 }),
  },
  {
    name: "Heading 3",
    icon: Heading3,
    command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 3 }),
  },
  {
    name: "To-do List",
    icon: CheckSquare,
    command: (editor) => editor.chain().focus().clearNodes().toggleTaskList().run(),
    isActive: (editor) => editor.isActive("taskItem"),
  },
  {
    name: "Bullet List",
    icon: ListOrdered,
    command: (editor) => editor.chain().focus().clearNodes().toggleBulletList().run(),
    isActive: (editor) => editor.isActive("bulletList"),
  },
  {
    name: "Numbered List",
    icon: ListOrdered,
    command: (editor) => editor.chain().focus().clearNodes().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive("orderedList"),
  },
  {
    name: "Quote",
    icon: TextQuote,
    command: (editor) => editor.chain().focus().clearNodes().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive("blockquote"),
  },
  {
    name: "Code",
    icon: Code,
    command: (editor) => editor.chain().focus().clearNodes().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive("codeBlock"),
  },
];
interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NodeSelector = ({ open, onOpenChange }: NodeSelectorProps) => {
  const { editor } = useEditor();
  if (!editor) return null;
  const activeItem = items.filter((item) => item.isActive(editor)).pop() ?? {
    name: "Multiple",
  };

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild className="gap-2 rounded-none border-none hover:bg-accent focus:ring-0">
        <Button size="sm" variant="ghost" className="gap-2">
          <span className="whitespace-nowrap text-sm">{activeItem.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={5} align="start" className="w-48 p-1">
        {items.map((item) => (
          <EditorBubbleItem
            key={item.name}
            onSelect={(editor) => {
              item.command(editor);
              onOpenChange(false);
            }}
            className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-accent"
          >
            <div className="flex items-center space-x-2">
              <div className="rounded-sm border p-1">
                <item.icon className="h-3 w-3" />
              </div>
              <span>{item.name}</span>
            </div>
            {activeItem.name === item.name && <Check className="h-4 w-4" />}
          </EditorBubbleItem>
        ))}
      </PopoverContent>
    </Popover>
  );
};

```

# components/tailwind/selectors/text-buttons.tsx

```tsx
import { Button } from "@/components/tailwind/ui/button";
import { cn } from "@/lib/utils";
import { BoldIcon, CodeIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";
import type { SelectorItem } from "./node-selector";

export const TextButtons = () => {
  const { editor } = useEditor();
  if (!editor) return null;
  const items: SelectorItem[] = [
    {
      name: "bold",
      isActive: (editor) => editor.isActive("bold"),
      command: (editor) => editor.chain().focus().toggleBold().run(),
      icon: BoldIcon,
    },
    {
      name: "italic",
      isActive: (editor) => editor.isActive("italic"),
      command: (editor) => editor.chain().focus().toggleItalic().run(),
      icon: ItalicIcon,
    },
    {
      name: "underline",
      isActive: (editor) => editor.isActive("underline"),
      command: (editor) => editor.chain().focus().toggleUnderline().run(),
      icon: UnderlineIcon,
    },
    {
      name: "strike",
      isActive: (editor) => editor.isActive("strike"),
      command: (editor) => editor.chain().focus().toggleStrike().run(),
      icon: StrikethroughIcon,
    },
    {
      name: "code",
      isActive: (editor) => editor.isActive("code"),
      command: (editor) => editor.chain().focus().toggleCode().run(),
      icon: CodeIcon,
    },
  ];
  return (
    <div className="flex">
      {items.map((item) => (
        <EditorBubbleItem
          key={item.name}
          onSelect={(editor) => {
            item.command(editor);
          }}
        >
          <Button size="sm" className="rounded-none" variant="ghost" type="button">
            <item.icon
              className={cn("h-4 w-4", {
                "text-blue-500": item.isActive(editor),
              })}
            />
          </Button>
        </EditorBubbleItem>
      ))}
    </div>
  );
};

```

# components/tailwind/slash-command.tsx

```tsx
import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  MessageSquarePlus,
  Text,
  TextQuote,
  Twitter,
  Youtube,
} from "lucide-react";
import { Command, createSuggestionItems, renderItems } from "novel";
import { uploadFn } from "./image-upload";

export const suggestionItems = createSuggestionItems([
  {
    title: "Send Feedback",
    description: "Let us know how we can improve.",
    icon: <MessageSquarePlus size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      window.open("/feedback", "_blank");
    },
  },
  {
    title: "Text",
    description: "Just start typing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: <Text size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
    },
  },
  {
    title: "To-do List",
    description: "Track tasks with a to-do list.",
    searchTerms: ["todo", "task", "list", "check", "checkbox"],
    icon: <CheckSquare size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: "Heading 1",
    description: "Big section heading.",
    searchTerms: ["title", "big", "large"],
    icon: <Heading1 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading.",
    searchTerms: ["subtitle", "medium"],
    icon: <Heading2 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading.",
    searchTerms: ["subtitle", "small"],
    icon: <Heading3 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list.",
    searchTerms: ["unordered", "point"],
    icon: <List size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a list with numbering.",
    searchTerms: ["ordered"],
    icon: <ListOrdered size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Quote",
    description: "Capture a quote.",
    searchTerms: ["blockquote"],
    icon: <TextQuote size={18} />,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").toggleBlockquote().run(),
  },
  {
    title: "Code",
    description: "Capture a code snippet.",
    searchTerms: ["codeblock"],
    icon: <Code size={18} />,
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "Image",
    description: "Upload an image from your computer.",
    searchTerms: ["photo", "picture", "media"],
    icon: <ImageIcon size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      // upload image
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        if (input.files?.length) {
          const file = input.files[0];
          const pos = editor.view.state.selection.from;
          uploadFn(file, editor.view, pos);
        }
      };
      input.click();
    },
  },
  {
    title: "Youtube",
    description: "Embed a Youtube video.",
    searchTerms: ["video", "youtube", "embed"],
    icon: <Youtube size={18} />,
    command: ({ editor, range }) => {
      const videoLink = prompt("Please enter Youtube Video Link");
      //From https://regexr.com/3dj5t
      const ytregex = new RegExp(
        /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/,
      );

      if (ytregex.test(videoLink)) {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setYoutubeVideo({
            src: videoLink,
          })
          .run();
      } else {
        if (videoLink !== null) {
          alert("Please enter a correct Youtube Video Link");
        }
      }
    },
  },
  {
    title: "Twitter",
    description: "Embed a Tweet.",
    searchTerms: ["twitter", "embed"],
    icon: <Twitter size={18} />,
    command: ({ editor, range }) => {
      const tweetLink = prompt("Please enter Twitter Link");
      const tweetRegex = new RegExp(/^https?:\/\/(www\.)?x\.com\/([a-zA-Z0-9_]{1,15})(\/status\/(\d+))?(\/\S*)?$/);

      if (tweetRegex.test(tweetLink)) {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setTweet({
            src: tweetLink,
          })
          .run();
      } else {
        if (tweetLink !== null) {
          alert("Please enter a correct Twitter Link");
        }
      }
    },
  },
]);

export const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
});

```

# components/tailwind/ui/button.tsx

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

```

# components/tailwind/ui/command.tsx

```tsx
"use client";

import type { DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import * as React from "react";

import { Dialog, DialogContent } from "@/components/tailwind/ui/dialog";
import Magic from "@/components/tailwind/ui/icons/magic";
import { cn } from "@/lib/utils";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-4" cmdk-input-wrapper="">
    <Magic className="mr-2 h-4 w-4 shrink-0 text-purple-500 " />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />);

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className,
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator ref={ref} className={cn("-mx-1 h-px bg-border", className)} {...props} />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled='true']:pointer-events-none data-[disabled='true']:opacity-50",
      className,
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};

```

# components/tailwind/ui/dialog.tsx

```tsx
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

```

# components/tailwind/ui/icons/crazy-spinner.tsx

```tsx
const CrazySpinner = () => {
  return (
    <div className="flex items-center justify-center gap-0.5">
      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.3s]" />
      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.15s]" />
      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-500" />
    </div>
  );
};

export default CrazySpinner;

```

# components/tailwind/ui/icons/font-default.tsx

```tsx
export default function FontDefault({ className }: { className?: string }) {
  return (
    <svg width="27" height="17" viewBox="0 0 27 17" xmlns="http://www.w3.org/2000/svg" className={className}>
      <title>Font Default Icon</title>
      <path
        d="M2.67735 16.7224H0L6.01587 0H8.92994L14.9458 16.7224H12.2685L7.54229 3.03746H7.41169L2.67735 16.7224ZM3.12629 10.1739H11.8114V12.2968H3.12629V10.1739Z"
        fill="currentColor"
      />
      <path
        d="M20.8127 17C20.0182 17 19.2999 16.853 18.6578 16.5591C18.0156 16.2597 17.5068 15.8269 17.1314 15.2608C16.7613 14.6947 16.5763 14.0006 16.5763 13.1787C16.5763 12.471 16.7123 11.8886 16.9844 11.4313C17.2565 10.9741 17.6238 10.6121 18.0864 10.3453C18.5489 10.0786 19.0659 9.8772 19.6373 9.74111C20.2087 9.60503 20.7909 9.5016 21.3841 9.43084C22.1351 9.34374 22.7445 9.27298 23.2125 9.21854C23.6805 9.15866 24.0206 9.0634 24.2329 8.93276C24.4451 8.80211 24.5512 8.58982 24.5512 8.29587V8.23871C24.5512 7.52562 24.3499 6.9731 23.9472 6.58117C23.5499 6.18924 22.9568 5.99328 22.1677 5.99328C21.346 5.99328 20.6984 6.17563 20.225 6.54035C19.757 6.89962 19.4332 7.29971 19.2536 7.74063L16.9599 7.21806C17.232 6.45597 17.6293 5.84086 18.1517 5.37272C18.6795 4.89914 19.2863 4.5562 19.972 4.3439C20.6576 4.12616 21.3787 4.01729 22.1351 4.01729C22.6357 4.01729 23.1663 4.07717 23.7268 4.19693C24.2927 4.31124 24.8206 4.52354 25.3103 4.83381C25.8055 5.14409 26.2109 5.58774 26.5266 6.16475C26.8422 6.73631 27 7.47935 27 8.39385V16.7224H24.6165V15.0077H24.5186C24.3607 15.3234 24.124 15.6337 23.8084 15.9385C23.4928 16.2434 23.0874 16.4965 22.5922 16.6979C22.097 16.8993 21.5038 17 20.8127 17ZM21.3433 15.0403C22.0181 15.0403 22.5949 14.907 23.0738 14.6403C23.5581 14.3735 23.9254 14.0251 24.1757 13.5951C24.4315 13.1596 24.5594 12.6942 24.5594 12.1988V10.5821C24.4723 10.6692 24.3036 10.7509 24.0533 10.8271C23.8084 10.8979 23.5282 10.9605 23.2125 11.0149C22.8969 11.0639 22.5894 11.1102 22.2902 11.1537C21.9909 11.1918 21.7405 11.2245 21.5392 11.2517C21.0658 11.3116 20.6331 11.4123 20.2413 11.5538C19.855 11.6953 19.5448 11.8995 19.3108 12.1662C19.0822 12.4275 18.968 12.7759 18.968 13.2113C18.968 13.8156 19.1911 14.2728 19.6373 14.5831C20.0835 14.8879 20.6522 15.0403 21.3433 15.0403Z"
        fill="currentColor"
      />
    </svg>
  );
}

```

# components/tailwind/ui/icons/font-mono.tsx

```tsx
export default function FontMono({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="19"
      viewBox="0 0 28 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Font Mono Icon</title>
      <path
        d="M10.4513 13.9906H3.35401L3.80321 11.8861H9.94225L10.4513 13.9906ZM7.06738 5.72075L2.90481 18.6739H0L6.4984 0H7.66631L14.1647 18.6739H11.1701L7.06738 5.72075Z"
        fill="currentColor"
      />
      <path
        d="M20.6032 19C19.066 19 17.8681 18.6542 17.0096 17.9626C16.1711 17.2512 15.7519 16.3323 15.7519 15.2059C15.7519 14.455 15.9216 13.7832 16.261 13.1903C16.6203 12.5777 17.1194 12.0541 17.7583 11.6193C18.4171 11.1846 19.2057 10.8487 20.1241 10.6115C21.0424 10.3547 22.0806 10.2262 23.2385 10.2262C23.4781 10.2262 23.7276 10.2361 23.9872 10.2559C24.2667 10.2559 24.5562 10.2657 24.8556 10.2855C25.175 10.3053 25.4945 10.325 25.8139 10.3448L25.9037 12.4493C25.6242 12.4098 25.3248 12.3801 25.0053 12.3604C24.7059 12.3406 24.4064 12.3307 24.107 12.3307C23.8075 12.3307 23.528 12.3307 23.2685 12.3307C22.4898 12.3307 21.8111 12.39 21.2321 12.5086C20.6731 12.6074 20.2039 12.7655 19.8246 12.9828C19.4652 13.2002 19.1957 13.467 19.016 13.7832C18.8364 14.0993 18.7465 14.4649 18.7465 14.8799C18.7465 15.2158 18.8064 15.5122 18.9262 15.7691C19.046 16.0062 19.2057 16.194 19.4053 16.3323C19.625 16.4706 19.8745 16.5793 20.154 16.6583C20.4535 16.7176 20.7729 16.7473 21.1123 16.7473C21.7711 16.7473 22.3501 16.6386 22.8492 16.4212C23.3483 16.2038 23.7676 15.8877 24.107 15.4727C24.4663 15.038 24.7358 14.5044 24.9155 13.8721C25.0952 13.22 25.185 12.4592 25.185 11.5897C25.185 10.3843 25.0453 9.44566 24.7658 8.77379C24.5062 8.10192 24.1169 7.63755 23.5979 7.38066C23.0788 7.12376 22.4299 6.99532 21.6513 6.99532C21.0125 6.99532 20.3936 7.104 19.7947 7.32137C19.2157 7.51898 18.6467 7.89444 18.0877 8.44774L16.5005 6.66927C17.2592 5.95788 18.0877 5.4441 18.9861 5.12793C19.9045 4.81175 20.8428 4.65367 21.8011 4.65367C22.6795 4.65367 23.4881 4.76235 24.2267 4.97972C24.9854 5.17733 25.6442 5.51326 26.2032 5.98752C26.7822 6.46178 27.2214 7.104 27.5209 7.9142C27.8403 8.72439 28 9.75195 28 10.9969V18.6739H24.8856V16.9844C24.626 17.3796 24.3365 17.7155 24.0171 17.9922C23.6977 18.2491 23.3483 18.4566 22.969 18.6147C22.6096 18.753 22.2303 18.8518 21.831 18.9111C21.4317 18.9704 21.0225 19 20.6032 19Z"
        fill="currentColor"
      />
    </svg>
  );
}

```

# components/tailwind/ui/icons/font-serif.tsx

```tsx
export default function FontSerif({ className }: { className?: string }) {
  return (
    <svg
      width="31"
      height="18"
      viewBox="0 0 31 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Font Serif Icon</title>

      <path
        d="M0.108486 17.8929C0.0361621 17.8214 0 17.6875 0 17.4911C0 17.1696 0.0180811 17.0089 0.0542432 17.0089C0.198892 17.0089 0.406824 16.9732 0.67804 16.9018C0.967337 16.8304 1.23855 16.7411 1.49169 16.6339C1.7629 16.5089 1.93467 16.3839 2.007 16.2589C2.18781 15.9911 2.35958 15.6875 2.52231 15.3482C2.68504 14.9911 2.85681 14.5982 3.03762 14.1696L8.08224 2.11607C8.51619 1.02679 8.85069 0.383929 9.08574 0.1875C9.21231 0.0625 9.366 0 9.54681 0C9.67337 0 9.78186 0.0446429 9.87227 0.133929L15.5678 14.1696C15.7125 14.5089 15.8481 14.8482 15.9746 15.1875C16.1193 15.5089 16.2549 15.8214 16.3815 16.125C16.4538 16.3036 16.6165 16.4643 16.8696 16.6071C17.1228 16.7321 17.385 16.8304 17.6562 16.9018C17.9274 16.9732 18.1353 17.0089 18.28 17.0089C18.3523 17.0089 18.3885 17.1696 18.3885 17.4911C18.3885 17.6875 18.3704 17.8214 18.3342 17.8929L14.9169 17.7321L11.3911 17.8929C11.3188 17.8214 11.2826 17.6518 11.2826 17.3839C11.2826 17.1339 11.3188 17.0089 11.3911 17.0089C11.608 17.0089 11.9064 16.9554 12.2861 16.8482C12.6658 16.7411 12.8918 16.6161 12.9641 16.4732C13.0184 16.3661 13.0455 16.25 13.0455 16.125C13.0455 15.9464 13.0003 15.7054 12.9099 15.4018C12.8195 15.0982 12.6929 14.7232 12.5302 14.2768L11.5809 11.7857C11.5086 11.7143 11.4453 11.6786 11.3911 11.6786C11.1018 11.6607 10.7582 11.6518 10.3605 11.6518C9.98075 11.6339 9.54681 11.625 9.05862 11.625C8.08224 11.625 7.05162 11.6518 5.96675 11.7054C5.85827 11.7054 5.80402 11.7411 5.80402 11.8125L4.7734 14.3036C4.59259 14.75 4.45698 15.125 4.36658 15.4286C4.29425 15.7143 4.25809 15.9196 4.25809 16.0446C4.25809 16.2589 4.35754 16.4375 4.55643 16.5804C4.66492 16.6518 4.82765 16.7232 5.04462 16.7946C5.27967 16.8482 5.51473 16.9018 5.74978 16.9554C5.98484 16.9911 6.14756 17.0089 6.23797 17.0089C6.29221 17.0268 6.31933 17.1518 6.31933 17.3839C6.31933 17.5089 6.31029 17.6161 6.29221 17.7054C6.29221 17.7768 6.28317 17.8393 6.26509 17.8929C5.59609 17.8571 5.04462 17.8214 4.61067 17.7857C4.19481 17.75 3.80607 17.7321 3.44444 17.7321C3.08282 17.7321 2.64888 17.7411 2.14261 17.7589C1.63634 17.7768 0.958297 17.8214 0.108486 17.8929ZM8.57043 10.1786C9.22135 10.1786 9.96267 10.1518 10.7944 10.0982L10.8486 9.99107L8.7874 4.63393L6.56343 9.99107C6.56343 10.0625 6.58151 10.0982 6.61767 10.0982C7.25051 10.1518 7.90143 10.1786 8.57043 10.1786Z"
        fill="currentColor"
      />
      <path
        d="M23.0534 18C22.1493 18 21.408 17.7589 20.8294 17.2768C20.2689 16.7768 19.9886 16.0982 19.9886 15.2411C19.9886 14.6518 20.1785 14.1161 20.5582 13.6339C20.956 13.1518 21.5074 12.7411 22.2126 12.4018C22.4657 12.2768 22.6917 12.1786 22.8906 12.1071C23.1076 12.0179 23.3065 11.9375 23.4873 11.8661C24.1202 11.6696 24.6445 11.5089 25.0604 11.3839C25.4943 11.2589 25.8017 11.1696 25.9825 11.1161C26.1452 11.0268 26.2266 10.8839 26.2266 10.6875V9.21429C26.2266 8.58929 26.0819 8.09821 25.7927 7.74107C25.5034 7.38393 25.1146 7.20536 24.6264 7.20536C24.084 7.20536 23.6591 7.375 23.3517 7.71429C23.0443 8.03571 22.8906 8.5 22.8906 9.10714C22.8906 9.46429 22.755 9.73214 22.4838 9.91071C22.2126 10.0714 21.9052 10.1518 21.5617 10.1518C20.8927 10.1518 20.4226 9.9375 20.1514 9.50893C20.1514 9.08036 20.3141 8.66071 20.6395 8.25C20.965 7.82143 21.3899 7.4375 21.9143 7.09821C22.4567 6.75893 23.0534 6.49107 23.7043 6.29464C24.3552 6.08036 25.0061 5.97321 25.657 5.97321C26.7781 5.97321 27.6188 6.26786 28.1794 6.85714C28.7399 7.42857 29.0201 8.41964 29.0201 9.83036V15.1071C29.0201 15.8393 29.3185 16.2054 29.9151 16.2054C30.1864 16.2054 30.4937 16.0893 30.8373 15.8571C30.9458 15.875 31 15.9732 31 16.1518C31 16.4911 30.9458 16.7589 30.8373 16.9554C30.5661 17.1696 30.2044 17.3929 29.7524 17.625C29.3004 17.8571 28.8664 17.9732 28.4506 17.9732C28.0347 17.9732 27.6279 17.8214 27.2301 17.5179C26.8323 17.2143 26.5701 16.8839 26.4436 16.5268C26.2989 16.6518 26.1904 16.7411 26.1181 16.7946C26.0458 16.8482 25.9283 16.9375 25.7655 17.0625C25.3858 17.3125 24.97 17.5357 24.5179 17.7321C24.0659 17.9107 23.5777 18 23.0534 18ZM24.4366 16.2589C24.9248 16.2589 25.3406 16.1339 25.6842 15.8839C26.0458 15.6339 26.2266 15.3482 26.2266 15.0268V12.2946L24.4908 12.8839C24.0749 13.0625 23.7043 13.2768 23.3788 13.5268C23.0534 13.7768 22.8906 14.1339 22.8906 14.5982C22.8906 15.1696 23.0353 15.5893 23.3246 15.8571C23.6139 16.125 23.9845 16.2589 24.4366 16.2589Z"
        fill="currentColor"
      />
    </svg>
  );
}

```

# components/tailwind/ui/icons/index.tsx

```tsx
export { default as FontDefault } from "./font-default";
export { default as FontSerif } from "./font-serif";
export { default as FontMono } from "./font-mono";

```

# components/tailwind/ui/icons/loading-circle.tsx

```tsx
export default function LoadingCircle({ dimensions }: { dimensions?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`${dimensions || "h-4 w-4"} animate-spin fill-stone-600 text-stone-200`}
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  );
}

```

# components/tailwind/ui/icons/magic.tsx

```tsx
export default function Magic({ className }: { className: string }) {
  return (
    <svg
      width="469"
      height="469"
      viewBox="0 0 469 469"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      className={className}
    >
      <title>Magic AI icon</title>

      <path
        d="M237.092 62.3004L266.754 71.4198C267.156 71.5285 267.51 71.765 267.765 72.0934C268.02 72.4218 268.161 72.8243 268.166 73.2399C268.172 73.6555 268.042 74.0616 267.796 74.3967C267.55 74.7318 267.201 74.9777 266.803 75.097L237.141 84.3145C236.84 84.4058 236.566 84.5699 236.344 84.7922C236.121 85.0146 235.957 85.2883 235.866 85.5893L226.747 115.252C226.638 115.653 226.401 116.008 226.073 116.263C225.745 116.517 225.342 116.658 224.926 116.664C224.511 116.669 224.105 116.539 223.77 116.293C223.435 116.047 223.189 115.699 223.069 115.301L213.852 85.6383C213.761 85.3374 213.597 85.0636 213.374 84.8412C213.152 84.6189 212.878 84.4548 212.577 84.3635L182.914 75.2441C182.513 75.1354 182.158 74.8989 181.904 74.5705C181.649 74.2421 181.508 73.8396 181.503 73.424C181.497 73.0084 181.627 72.6023 181.873 72.2672C182.119 71.9321 182.467 71.6863 182.865 71.5669L212.528 62.3494C212.829 62.2582 213.103 62.0941 213.325 61.8717C213.547 61.6494 213.712 61.3756 213.803 61.0747L222.922 31.4121C223.031 31.0109 223.267 30.656 223.596 30.4013C223.924 30.1465 224.327 30.0057 224.742 30.0002C225.158 29.9946 225.564 30.1247 225.899 30.3706C226.234 30.6165 226.48 30.9649 226.599 31.363L235.817 61.0257C235.908 61.3266 236.072 61.6003 236.295 61.8227C236.517 62.0451 236.791 62.2091 237.092 62.3004Z"
        fill="currentColor"
      />
      <path
        d="M155.948 155.848L202.771 168.939C203.449 169.131 204.045 169.539 204.47 170.101C204.895 170.663 205.125 171.348 205.125 172.052C205.125 172.757 204.895 173.442 204.47 174.004C204.045 174.566 203.449 174.974 202.771 175.166L155.899 188.06C155.361 188.209 154.87 188.496 154.475 188.891C154.079 189.286 153.793 189.777 153.644 190.316L140.553 237.138C140.361 237.816 139.953 238.413 139.391 238.838C138.829 239.262 138.144 239.492 137.44 239.492C136.735 239.492 136.05 239.262 135.488 238.838C134.927 238.413 134.519 237.816 134.327 237.138L121.432 190.267C121.283 189.728 120.997 189.237 120.601 188.842C120.206 188.446 119.715 188.16 119.177 188.011L72.3537 174.92C71.676 174.728 71.0795 174.32 70.6547 173.759C70.2299 173.197 70 172.512 70 171.807C70 171.103 70.2299 170.418 70.6547 169.856C71.0795 169.294 71.676 168.886 72.3537 168.694L119.226 155.799C119.764 155.65 120.255 155.364 120.65 154.969C121.046 154.573 121.332 154.082 121.481 153.544L134.572 106.721C134.764 106.043 135.172 105.447 135.734 105.022C136.295 104.597 136.981 104.367 137.685 104.367C138.389 104.367 139.075 104.597 139.637 105.022C140.198 105.447 140.606 106.043 140.798 106.721L153.693 153.593C153.842 154.131 154.128 154.622 154.524 155.018C154.919 155.413 155.41 155.699 155.948 155.848Z"
        fill="currentColor"
      />
      <path
        d="M386.827 289.992C404.33 292.149 403.84 305.828 386.876 307.299C346.623 310.829 298.869 316.271 282.199 360.005C274.844 379.192 269.942 403.2 267.49 432.029C267.427 432.846 267.211 433.626 266.856 434.319C266.501 435.012 266.015 435.602 265.431 436.05C254.988 444.041 251.212 434.186 250.183 425.606C239.2 332.353 214.588 316.909 124.668 306.122C123.892 306.031 123.151 305.767 122.504 305.35C121.857 304.933 121.322 304.375 120.942 303.72C116.399 295.679 119.324 291.038 129.718 289.796C224.688 278.47 236.062 262.83 250.183 169.331C252.177 156.355 257.259 154.083 265.431 162.516C266.51 163.593 267.202 165.099 267.392 166.782C279.257 258.564 293.328 278.617 386.827 289.992Z"
        fill="currentColor"
      />
    </svg>
  );
}

```

# components/tailwind/ui/menu.tsx

```tsx
"use client";

import { Check, Menu as MenuIcon, Monitor, Moon, SunDim } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

// TODO implement multiple fonts editor
// const fonts = [
//   {
//     font: "Default",
//     icon: <FontDefault className="h-4 w-4" />,
//   },
//   {
//     font: "Serif",
//     icon: <FontSerif className="h-4 w-4" />,
//   },
//   {
//     font: "Mono",
//     icon: <FontMono className="h-4 w-4" />,
//   },
// ];
const appearances = [
  {
    theme: "System",
    icon: <Monitor className="h-4 w-4" />,
  },
  {
    theme: "Light",
    icon: <SunDim className="h-4 w-4" />,
  },
  {
    theme: "Dark",
    icon: <Moon className="h-4 w-4" />,
  },
];
export default function Menu() {
  // const { font: currentFont, setFont } = useContext(AppContext);
  const { theme: currentTheme, setTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon width={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2" align="end">
        {/* <div className="p-2">
          <p className="p-2 text-xs font-medium text-stone-500">Font</p>
          {fonts.map(({ font, icon }) => (
            <button
              key={font}
              className="flex w-full items-center justify-between rounded px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
              onClick={() => {
                setFont(font);
              }}
            >
              <div className="flex items-center space-x-2">
                <div className="rounded-sm border border-stone-200 p-1">
                  {icon}
                </div>
                <span>{font}</span>
              </div>
              {currentFont === font && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div> */}
        <p className="p-2 text-xs font-medium text-muted-foreground">Appearance</p>
        {appearances.map(({ theme, icon }) => (
          <Button
            variant="ghost"
            key={theme}
            className="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm"
            onClick={() => {
              setTheme(theme.toLowerCase());
            }}
          >
            <div className="flex items-center space-x-2">
              <div className="rounded-sm border  p-1">{icon}</div>
              <span>{theme}</span>
            </div>
            {currentTheme === theme.toLowerCase() && <Check className="h-4 w-4" />}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

```

# components/tailwind/ui/popover.tsx

```tsx
"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };

```

# components/tailwind/ui/scroll-area.tsx

```tsx
"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">{children}</ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };

```

# components/tailwind/ui/separator.tsx

```tsx
"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : " w-[1px]", className)}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };

```

# hooks/use-local-storage.ts

```ts
import { useEffect, useState } from "react";

const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  // eslint-disable-next-line no-unused-vars
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    // Retrieve from localStorage
    const item = window.localStorage.getItem(key);
    if (item) {
      setStoredValue(JSON.parse(item));
    }
  }, [key]);

  const setValue = (value: T) => {
    // Save state
    setStoredValue(value);
    // Save to localStorage
    window.localStorage.setItem(key, JSON.stringify(value));
  };
  return [storedValue, setValue];
};

export default useLocalStorage;

```

# lib/content.ts

```ts
export const defaultEditorContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Introducing Novel" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://github.com/steven-tey/novel",
                target: "_blank",
              },
            },
          ],
          text: "Novel",
        },
        {
          type: "text",
          text: " is a Notion-style WYSIWYG editor with AI-powered autocompletion. Built with ",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://tiptap.dev/",
                target: "_blank",
              },
            },
          ],
          text: "Tiptap",
        },
        { type: "text", text: " + " },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://sdk.vercel.ai/docs",
                target: "_blank",
              },
            },
          ],
          text: "Vercel AI SDK",
        },
        { type: "text", text: "." },
      ],
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Installation" }],
    },
    {
      type: "codeBlock",
      attrs: { language: null },
      content: [{ type: "text", text: "npm i novel" }],
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Usage" }],
    },
    {
      type: "codeBlock",
      attrs: { language: null },
      content: [
        {
          type: "text",
          text: 'import { Editor } from "novel";\n\nexport default function App() {\n  return (\n     <Editor />\n  )\n}',
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Features" }],
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Slash menu & bubble menu" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", text: "AI autocomplete (type " },
                { type: "text", marks: [{ type: "code" }], text: "++" },
                {
                  type: "text",
                  text: " to activate, or select from slash menu)",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Image uploads (drag & drop / copy & paste, or select from slash menu) ",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Add tweets from the command slash menu:",
                },
              ],
            },
            {
              type: "twitter",
              attrs: {
                src: "https://x.com/elonmusk/status/1800759252224729577",
              },
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Mathematical symbols with LaTeX expression:",
                },
              ],
            },
            {
              type: "orderedList",
              attrs: {
                tight: true,
                start: 1,
              },
              content: [
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "math",
                          attrs: {
                            latex: "E = mc^2",
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "math",
                          attrs: {
                            latex: "a^2 = \\sqrt{b^2 + c^2}",
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "math",
                          attrs: {
                            latex:
                              "\\hat{f} (\\xi)=\\int_{-\\infty}^{\\infty}f(x)e^{-2\\pi ix\\xi}dx",
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "math",
                          attrs: {
                            latex:
                              "A=\\begin{bmatrix}a&b\\\\c&d \\end{bmatrix}",
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "math",
                          attrs: {
                            latex: "\\sum_{i=0}^n x_i",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "image",
      attrs: {
        src: "https://public.blob.vercel-storage.com/pJrjXbdONOnAeZAZ/banner-2wQk82qTwyVgvlhTW21GIkWgqPGD2C.png",
        alt: "banner.png",
        title: "banner.png",
        width: null,
        height: null,
      },
    },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Learn more" }],
    },
    {
      type: "taskList",
      content: [
        {
          type: "taskItem",
          attrs: { checked: false },
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", text: "Star us on " },
                {
                  type: "text",
                  marks: [
                    {
                      type: "link",
                      attrs: {
                        href: "https://github.com/steven-tey/novel",
                        target: "_blank",
                      },
                    },
                  ],
                  text: "GitHub",
                },
              ],
            },
          ],
        },
        {
          type: "taskItem",
          attrs: { checked: false },
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", text: "Install the " },
                {
                  type: "text",
                  marks: [
                    {
                      type: "link",
                      attrs: {
                        href: "https://www.npmjs.com/package/novel",
                        target: "_blank",
                      },
                    },
                  ],
                  text: "NPM package",
                },
              ],
            },
          ],
        },
        {
          type: "taskItem",
          attrs: { checked: false },
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [
                    {
                      type: "link",
                      attrs: {
                        href: "https://vercel.com/templates/next.js/novel",
                        target: "_blank",
                      },
                    },
                  ],
                  text: "Deploy your own",
                },
                { type: "text", text: " to Vercel" },
              ],
            },
          ],
        },
      ],
    },
  ],
};

```

# lib/indexeddb.ts

```ts
import type { JSONContent } from "novel";

export interface Document {
  id: string;
  title: string;
  content: JSONContent;
  lastModified: number;
}

const DB_NAME = 'NovelDB';
const DB_VERSION = 2;
const STORE_NAME = 'documents';

export const initDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      const error = (event.target as IDBOpenDBRequest).error;
      if (error?.name === 'VersionError') {
        // If version error occurs, delete the database and try again
        indexedDB.deleteDatabase(DB_NAME).onsuccess = () => {
          initDB().then(resolve).catch(reject);
        };
      } else {
        reject(error);
      }
    };
    
    request.onsuccess = () => resolve();

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('lastModified', 'lastModified', { unique: false });
      }
    };
  });
};

export const saveDocument = async (document: Document): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    store.put(document);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    };
  });
};

export const getDocument = async (id: string): Promise<Document | null> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => resolve(getRequest.result || null);
    getRequest.onerror = () => reject(getRequest.error);
    };
  });
};

export const getAllDocuments = async (): Promise<Document[]> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('lastModified');
    const getRequest = index.getAll();

    getRequest.onsuccess = () => {
      const documents = getRequest.result || [];
      resolve(documents.sort((a, b) => b.lastModified - a.lastModified));
    };
    getRequest.onerror = () => reject(getRequest.error);
    };
  });
};

export const deleteDocument = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const deleteRequest = store.delete(id);

    deleteRequest.onsuccess = () => resolve();
    deleteRequest.onerror = () => reject(deleteRequest.error);
};
  });
}; 

```

# lib/utils.ts

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

# next-env.d.ts

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```

# next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: "/github",
        destination: "https://github.com/steven-tey/novel",
        permanent: true,
      },
      {
        source: "/sdk",
        destination: "https://www.npmjs.com/package/novel",
        permanent: true,
      },
      {
        source: "/npm",
        destination: "https://www.npmjs.com/package/novel",
        permanent: true,
      },
      {
        source: "/svelte",
        destination: "https://github.com/tglide/novel-svelte",
        permanent: false,
      },
      {
        source: "/vue",
        destination: "https://github.com/naveennaidu/novel-vue",
        permanent: false,
      },
      {
        source: "/vscode",
        destination:
          "https://marketplace.visualstudio.com/items?itemName=bennykok.novel-vscode",
        permanent: false,
      },
      {
        source: "/feedback",
        destination: "https://github.com/steven-tey/novel/issues",
        permanent: true,
      },
      {
        source: "/deploy",
        destination: "https://vercel.com/templates/next.js/novel",
        permanent: true,
      },
    ];
  },
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig;

```

# package.json

```json
{
  "name": "novel-next-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "biome lint .",
    "format": "biome format . ",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@ai-sdk/openai": "latest",
    "@ai-sdk/provider": "latest",
    "ai": "latest",
    "@assistant-ui/react": "^0.7.87",
    "@assistant-ui/react-ui": "^0.1.7",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slot": "^1.0.2",
    "@tailwindcss/typography": "^0.5.10",
    "@tiptap/core": "^2.11.5",
    "@tiptap/pm": "^2.11.2",
    "@tiptap/react": "^2.11.5",
    "@tiptap/starter-kit": "^2.11.5",
    "@types/diff": "^7.0.1",
    "@types/dompurify": "^3.2.0",
    "@upstash/ratelimit": "^1.0.1",
    "@vercel/analytics": "^1.2.2",
    "@vercel/blob": "^0.22.1",
    "@vercel/kv": "^1.0.1",
    "autoprefixer": "^10.4.17",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "cmdk": "^1.0.4",
    "diff": "^7.0.0",
    "dompurify": "^3.2.4",
    "eventsource-parser": "^1.1.2",
    "highlight.js": "^11.9.0",
    "lowlight": "^3.1.0",
    "lucide-react": "^0.358.0",
    "next": "15.1.4",
    "next-themes": "^0.2.1",
    "novel": "^1.0.2",
    "openai": "^4.28.4",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-markdown": "^9.0.3",
    "remark-gfm": "^4.0.1",
    "remark-parse": "^11.0.0",
    "sonner": "^1.4.3",
    "tailwind-merge": "^2.2.1",
    "tailwindcss-animate": "^1.0.7",
    "tippy.js": "^6.3.7",
    "ts-pattern": "^5.0.8",
    "typescript": "^5.4.2",
    "unified": "^11.0.5",
    "unist-util-visit": "^5.0.0",
    "use-debounce": "^10.0.0",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.7.2",
    "@types/node": "20.11.24",
    "@types/react": "^18.2.61",
    "@types/react-dom": "18.2.19",
    "tailwindcss": "^3.4.1"
  }
}
```

# postcss.config.js

```js
module.exports = {
  plugins: {
    "postcss-import": {},
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};

```

# styles/CalSans-SemiBold.otf

This is a binary file of the type: Binary

# styles/fonts.ts

```ts
import localFont from "next/font/local";
import { Crimson_Text, Inconsolata, Inter } from "next/font/google";

export const cal = localFont({
  src: "./CalSans-SemiBold.otf",
  variable: "--font-title",
});

export const crimsonBold = Crimson_Text({
  weight: "700",
  variable: "--font-title",
  subsets: ["latin"],
});

export const inter = Inter({
  variable: "--font-default",
  subsets: ["latin"],
});

export const inconsolataBold = Inconsolata({
  weight: "700",
  variable: "--font-title",
  subsets: ["latin"],
});

export const crimson = Crimson_Text({
  weight: "400",
  variable: "--font-default",
  subsets: ["latin"],
});

export const inconsolata = Inconsolata({
  variable: "--font-default",
  subsets: ["latin"],
});

export const titleFontMapper = {
  Default: cal.variable,
  Serif: crimsonBold.variable,
  Mono: inconsolataBold.variable,
};

export const defaultFontMapper = {
  Default: inter.variable,
  Serif: crimson.variable,
  Mono: inconsolata.variable,
};

```

# styles/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;

    --radius: 0.5rem;

    --novel-highlight-default: #ffffff;
    --novel-highlight-purple: #f6f3f8;
    --novel-highlight-red: #fdebeb;
    --novel-highlight-yellow: #fbf4a2;
    --novel-highlight-blue: #c1ecf9;
    --novel-highlight-green: #acf79f;
    --novel-highlight-orange: #faebdd;
    --novel-highlight-pink: #faf1f5;
    --novel-highlight-gray: #f1f1ef;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;

    --novel-highlight-default: #000000;
    --novel-highlight-purple: #3f2c4b;
    --novel-highlight-red: #5c1a1a;
    --novel-highlight-yellow: #5c4b1a;
    --novel-highlight-blue: #1a3d5c;
    --novel-highlight-green: #1a5c20;
    --novel-highlight-orange: #5c3a1a;
    --novel-highlight-pink: #5c1a3a;
    --novel-highlight-gray: #3a3a3a;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}


pre {
  background: #0d0d0d;
  border-radius: 0.5rem;
  color: #fff;
  font-family: "JetBrainsMono", monospace;
  padding: 0.75rem 1rem;

  code {
    background: none;
    color: inherit;
    font-size: 0.8rem;
    padding: 0;
  }

  .hljs-comment,
  .hljs-quote {
    color: #616161;
  }

  .hljs-variable,
  .hljs-template-variable,
  .hljs-attribute,
  .hljs-tag,
  .hljs-name,
  .hljs-regexp,
  .hljs-link,
  .hljs-name,
  .hljs-selector-id,
  .hljs-selector-class {
    color: #f98181;
  }

  .hljs-number,
  .hljs-meta,
  .hljs-built_in,
  .hljs-builtin-name,
  .hljs-literal,
  .hljs-type,
  .hljs-params {
    color: #fbbc88;
  }

  .hljs-string,
  .hljs-symbol,
  .hljs-bullet {
    color: #b9f18d;
  }

  .hljs-title,
  .hljs-section {
    color: #faf594;
  }

  .hljs-keyword,
  .hljs-selector-tag {
    color: #70cff8;
  }

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-strong {
    font-weight: 700;
  }
}

```

# styles/prosemirror.css

```css
.ProseMirror {
  @apply p-12 px-8 sm:px-12;
}

.ProseMirror .is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: hsl(var(--muted-foreground));
  pointer-events: none;
  height: 0;
}
.ProseMirror .is-empty::before {
  content: attr(data-placeholder);
  float: left;
  color: hsl(var(--muted-foreground));
  pointer-events: none;
  height: 0;
}

/* Custom image styles */

.ProseMirror img {
  transition: filter 0.1s ease-in-out;

  &:hover {
    cursor: pointer;
    filter: brightness(90%);
  }

  &.ProseMirror-selectednode {
    outline: 3px solid #5abbf7;
    filter: brightness(90%);
  }
}

.img-placeholder {
  position: relative;

  &:before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 3px solid var(--novel-stone-200);
    border-top-color: var(--novel-stone-800);
    animation: spinning 0.6s linear infinite;
  }
}

@keyframes spinning {
  to {
    transform: rotate(360deg);
  }
}

/* Custom TODO list checkboxes – shoutout to this awesome tutorial: https://moderncss.dev/pure-css-custom-checkbox-style/ */

ul[data-type="taskList"] li > label {
  margin-right: 0.2rem;
  user-select: none;
}

@media screen and (max-width: 768px) {
  ul[data-type="taskList"] li > label {
    margin-right: 0.5rem;
  }
}

ul[data-type="taskList"] li > label input[type="checkbox"] {
  -webkit-appearance: none;
  appearance: none;
  background-color: hsl(var(--background));
  margin: 0;
  cursor: pointer;
  width: 1.2em;
  height: 1.2em;
  position: relative;
  top: 5px;
  border: 2px solid hsl(var(--border));
  margin-right: 0.3rem;
  display: grid;
  place-content: center;

  &:hover {
    background-color: hsl(var(--accent));
  }

  &:active {
    background-color: hsl(var(--accent));
  }

  &::before {
    content: "";
    width: 0.65em;
    height: 0.65em;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em;
    transform-origin: center;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  }

  &:checked::before {
    transform: scale(1);
  }
}

ul[data-type="taskList"] li[data-checked="true"] > div > p {
  color: var(--muted-foreground);
  text-decoration: line-through;
  text-decoration-thickness: 2px;
}

/* Overwrite tippy-box original max-width */

.tippy-box {
  max-width: 400px !important;
}

.ProseMirror:not(.dragging) .ProseMirror-selectednode {
  outline: none !important;
  background-color: var(--novel-highlight-blue);
  transition: background-color 0.2s;
  box-shadow: none;
}

.drag-handle {
  position: fixed;
  opacity: 1;
  transition: opacity ease-in 0.2s;
  border-radius: 0.25rem;

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' style='fill: rgba(0, 0, 0, 0.5)'%3E%3Cpath d='M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z'%3E%3C/path%3E%3C/svg%3E");
  background-size: calc(0.5em + 0.375rem) calc(0.5em + 0.375rem);
  background-repeat: no-repeat;
  background-position: center;
  width: 1.2rem;
  height: 1.5rem;
  z-index: 50;
  cursor: grab;

  &:hover {
    background-color: var(--novel-stone-100);
    transition: background-color 0.2s;
  }

  &:active {
    background-color: var(--novel-stone-200);
    transition: background-color 0.2s;
    cursor: grabbing;
  }

  &.hide {
    opacity: 0;
    pointer-events: none;
  }

  @media screen and (max-width: 600px) {
    display: none;
    pointer-events: none;
  }
}

.dark .drag-handle {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' style='fill: rgba(255, 255, 255, 0.5)'%3E%3Cpath d='M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z'%3E%3C/path%3E%3C/svg%3E");
}

/* Custom Youtube Video CSS */
iframe {
  border: 8px solid #ffd00027;
  border-radius: 4px;
  min-width: 200px;
  min-height: 200px;
  display: block;
  outline: 0px solid transparent;
}

div[data-youtube-video] > iframe {
  cursor: move;
  aspect-ratio: 16 / 9;
  width: 100%;
}

.ProseMirror-selectednode iframe {
  transition: outline 0.15s;
  outline: 6px solid #fbbf24;
}

@media only screen and (max-width: 480px) {
  div[data-youtube-video] > iframe {
    max-height: 50px;
  }
}

@media only screen and (max-width: 720px) {
  div[data-youtube-video] > iframe {
    max-height: 100px;
  }
}

/* CSS for bold coloring and highlighting issue*/
span[style] > strong {
  color: inherit;
}

mark[style] > strong {
  color: inherit;
}
```

# tailwind.config.ts

```ts
import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;

```

# tsconfig.json

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "preserve",
    
    // Next.js specific
    "plugins": [{ "name": "next" }],
    
    // Type checking
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true,
    
    // Module features
    "allowJs": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "verbatimModuleSyntax": true,
    
    // Emit
    "noEmit": true,
    "incremental": true,
    
    // Performance
    "skipLibCheck": true,
    
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}

```

# vercel.json

```json
{
  "rewrites": [
    {
      "source": "/docs",
      "destination": "https://novel.mintlify.dev/docs"
    },
    {
      "source": "/docs/:match*",
      "destination": "https://novel.mintlify.dev/docs/:match*"
    }
  ]
}

```

