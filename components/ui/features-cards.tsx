'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Brain, Bot, Lightbulb, Terminal, Palette, Presentation, LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { motion } from 'framer-motion'

export function FeaturesCards() {
    return (
        <section className="bg-white py-16 md:py-32">
            <div className="mx-auto max-w-2xl px-6 lg:max-w-6xl">
                <div className="mx-auto grid gap-6 lg:grid-cols-2">
                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={Brain}
                                title="AI Generation"
                                description="Transform prompts into complete presentations with intelligent content structuring and automatic slide creation."
                            />
                        </CardHeader>

                        <div className="relative mb-6 border-t border-dashed sm:mb-0">
                            <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,hsl(var(--muted)),white_125%)]"></div>
                            <div className="aspect-[76/59] p-1 px-6">
                                <DualModeImage
                                    darkSrc="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop"
                                    lightSrc="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop"
                                    alt="AI presentation generation illustration"
                                    width={800}
                                    height={600}
                                />
                            </div>
                        </div>
                    </FeatureCard>

                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={Bot}
                                title="AI Assistant"
                                description="Chat naturally with AI to edit slides, get suggestions, and enhance your presentations in real-time."
                            />
                        </CardHeader>

                        <CardContent>
                            <div className="relative mb-6 sm:mb-0">
                                <div className="absolute -inset-6 [background:radial-gradient(50%_50%_at_75%_50%,transparent,hsl(var(--background))_100%)]"></div>
                                <div className="aspect-[76/59] border rounded-lg overflow-hidden">
                                    <DualModeImage
                                        darkSrc="https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&h=600&fit=crop"
                                        lightSrc="https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&h=600&fit=crop"
                                        alt="AI assistant chat interface"
                                        width={800}
                                        height={600}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </FeatureCard>

                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={Lightbulb}
                                title="Brainstorming Mode"
                                description="Explore ideas with AI before creating presentations. Refine concepts through conversation and discover new angles."
                            />
                        </CardHeader>

                        <CardContent>
                            <div className="relative mb-6 sm:mb-0">
                                <div className="absolute -inset-6 [background:radial-gradient(50%_50%_at_75%_50%,transparent,hsl(var(--background))_100%)]"></div>
                                <div className="aspect-[76/59] border rounded-lg overflow-hidden">
                                    <DualModeImage
                                        darkSrc="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop"
                                        lightSrc="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop"
                                        alt="brainstorming and idea generation"
                                        width={800}
                                        height={600}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </FeatureCard>

                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={Terminal}
                                title="MCP Integration"
                                description="Create presentations directly from Claude Code, Cursor, Windsurf, and VS Code with seamless developer workflow."
                            />
                        </CardHeader>

                        <CardContent>
                            <div className="relative mb-6 sm:mb-0">
                                <div className="absolute -inset-6 [background:radial-gradient(50%_50%_at_75%_50%,transparent,hsl(var(--background))_100%)]"></div>
                                <div className="aspect-[76/59] border rounded-lg overflow-hidden">
                                    <DualModeImage
                                        darkSrc="https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?w=800&h=600&fit=crop"
                                        lightSrc="https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?w=800&h=600&fit=crop"
                                        alt="developer tools and IDE integration"
                                        width={800}
                                        height={600}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </FeatureCard>

                    <FeatureCard className="p-6 lg:col-span-2">
                        <p className="mx-auto my-6 max-w-md text-balance text-center text-2xl font-semibold">Professional themes and templates that adapt to your content automatically.</p>

                        <div className="flex justify-center gap-6 overflow-hidden">
                            <ThemePreview
                                label="Professional"
                                colors={[{ pattern: 'blue' }, { pattern: 'primary' }]}
                            />

                            <ThemePreview
                                label="Creative"
                                colors={[{ pattern: 'purple' }, { pattern: 'pink' }]}
                            />

                            <ThemePreview
                                label="Modern"
                                colors={[{ pattern: 'green' }, { pattern: 'blue' }]}
                            />

                            <ThemePreview
                                label="Minimal"
                                colors={[{ pattern: 'border' }, { pattern: 'none' }]}
                                className="hidden sm:block"
                            />
                        </div>
                    </FeatureCard>
                </div>
            </div>
        </section>
    )
}

interface FeatureCardProps {
    children: ReactNode
    className?: string
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="group"
    >
        <Card className={cn('group relative rounded-xl shadow-lg border-gray-200 hover:shadow-xl transition-all duration-300', className)}>
            <CardDecorator />
            {children}
        </Card>
    </motion.div>
)

const CardDecorator = () => (
    <>
        <span className="border-purple-500 absolute -left-px -top-px block size-2 border-l-2 border-t-2"></span>
        <span className="border-purple-500 absolute -right-px -top-px block size-2 border-r-2 border-t-2"></span>
        <span className="border-purple-500 absolute -bottom-px -left-px block size-2 border-b-2 border-l-2"></span>
        <span className="border-purple-500 absolute -bottom-px -right-px block size-2 border-b-2 border-r-2"></span>
    </>
)

interface CardHeadingProps {
    icon: LucideIcon
    title: string
    description: string
}

const CardHeading = ({ icon: Icon, title, description }: CardHeadingProps) => (
    <div className="p-6">
        <span className="text-purple-600 flex items-center gap-2 font-medium">
            <Icon className="size-5" />
            {title}
        </span>
        <p className="mt-4 text-xl font-semibold text-gray-900 leading-relaxed">{description}</p>
    </div>
)

interface DualModeImageProps {
    darkSrc: string
    lightSrc: string
    alt: string
    width: number
    height: number
    className?: string
}

const DualModeImage = ({ darkSrc, lightSrc, alt, width, height, className }: DualModeImageProps) => (
    <img
        src={lightSrc}
        className={cn('w-full h-full object-cover rounded-lg', className)}
        alt={alt}
        width={width}
        height={height}
    />
)

interface ColorConfig {
    pattern: 'none' | 'border' | 'primary' | 'blue' | 'purple' | 'pink' | 'green'
}

interface ThemePreviewProps {
    label: string
    colors: ColorConfig[]
    className?: string
}

const ThemePreview = ({ label, colors, className }: ThemePreviewProps) => (
    <div className={className}>
        <div className="bg-gradient-to-b from-gray-200 size-fit rounded-2xl to-transparent p-px">
            <div className="bg-gradient-to-b from-white to-gray-50 relative flex aspect-square w-fit items-center -space-x-4 rounded-[15px] p-4">
                {colors.map((color, i) => (
                    <div
                        key={i}
                        className={cn('size-7 rounded-full border sm:size-8', {
                            'border-gray-300 bg-white': color.pattern === 'none',
                            'border-gray-300 bg-gray-100': color.pattern === 'border',
                            'border-purple-500 bg-purple-500': color.pattern === 'primary' || color.pattern === 'purple',
                            'border-blue-500 bg-blue-500': color.pattern === 'blue',
                            'border-pink-500 bg-pink-500': color.pattern === 'pink',
                            'border-green-500 bg-green-500': color.pattern === 'green',
                        })}></div>
                ))}
            </div>
        </div>
        <span className="text-gray-600 mt-1.5 block text-center text-sm font-medium">{label}</span>
    </div>
)