"use client"

import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { PropsWithChildren, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CATEGORY_NAME_VALIDATOR } from '@/lib/validators/CategoryValidator'
import { Modal } from './Model'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils'
import { Button } from '@/components/ui/button'
import { client } from '../lib/client'

const EVENT_CATEGORY_VALIDATOR = z.object({
    name: CATEGORY_NAME_VALIDATOR,
    color: z
        .string()
        .min(1, "Color is required.")
        .regex(/^#[0-9a-fA-F]{6}$/i, "Invalid color format."),
    emoji: z.string().optional(),
})

type EVENT_CATEGORY_VALIDATOR = z.infer<typeof EVENT_CATEGORY_VALIDATOR>

const COLOR_OPTIONS = [
    "#FF6B6B", // bg-[#FF6B6B] ring-[#FF6B6B] Bright Red
    "#4ECDC4", // bg-[#4ECDC4] ring-[#4ECDC4] Teal
    "#45B7D1", // bg-[#45B7D1] ring-[#45B7D1] Sky Blue
    "#FFA07A", // bg-[#FFA07A] ring-[#FFA07A] Light Salmon
    "#98D8C8", // bg-[#98D8C8] ring-[#98D8C8] Seafoam Green
    "#FDCB6E", // bg-[#FDCB6E] ring-[#FDCB6E] Mustard Yellow
    "#6C5CE7", // bg-[#6C5CE7] ring-[#6C5CE7] Soft Purple
    "#FF85A2", // bg-[#FF85A2] ring-[#FF85A2] Pink
    "#2ECC71", // bg-[#2ECC71] ring-[#2ECC71] Emerald Green
    "#E17055", // bg-[#E17055] ring-[#E17055] Terracotta
]

const EMOJI_OPTIONS = [
    { emoji: "💰", label: "Money (Sale)" },
    { emoji: "👤", label: "User (Sign-up)" },
    { emoji: "🎉", label: "Celebration" },
    { emoji: "📅", label: "Calendar" },
    { emoji: "🚀", label: "Launch" },
    { emoji: "📢", label: "Announcement" },
    { emoji: "🎓", label: "Graduation" },
    { emoji: "🏆", label: "Achievement" },
    { emoji: "💡", label: "Idea" },
    { emoji: "🔔", label: "Notification" },
]

interface CreateEventCategoryProps extends PropsWithChildren {
    containerClassName?: string
}

const CreateCategoryModal = ({ children, containerClassName }: CreateEventCategoryProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const queryClient = useQueryClient()

    const { mutate: createEventCategory, isPending } = useMutation({
        mutationFn: async (data: EVENT_CATEGORY_VALIDATOR) => {
            await client.category.createEventCategory.$post(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-event-categories"] })
            setIsOpen(false)
            reset()
        },
    })

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors }
    } = useForm<EVENT_CATEGORY_VALIDATOR>({
        resolver: zodResolver(EVENT_CATEGORY_VALIDATOR),
    })

    const color = watch('color')
    const selectedEmoji = watch('emoji')

    const onSubmit = (data: EVENT_CATEGORY_VALIDATOR) => {
        createEventCategory(data)
    }

    return (
        <>
            <div className={containerClassName} onClick={() => setIsOpen(true)}>{children}</div>

            <Modal
                className='p-8 max-w-xl'
                showModal={isOpen}
                setShowModal={setIsOpen}
            >
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div>
                        <h2 className="text-lg/7 font-medium tracking-tight to-gray-950">
                            New Event Category
                        </h2>

                        <p className="text-sm/6 to-gray-600">
                            Create a new category to organize your events.
                        </p>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                autoFocus
                                id="name"
                                {...register('name')}
                                placeholder="e.g. User-SignUp"
                                className='w-full'
                            />
                            {errors.name ?
                                <p className='text-red-500'>
                                    {errors.name.message}
                                </p>
                                : null}
                        </div>

                        <div>
                            <Label>Color</Label>
                            <div className="flex flex-wrap gap-3">
                                {COLOR_OPTIONS.map((premadeColor) => (
                                    <button
                                        key={premadeColor}
                                        type="button"
                                        className={cn(
                                            `bg-[${premadeColor}]`,
                                            "size-10 rounded-full ring-2 ring-offset-2 transition-all",
                                            color === premadeColor
                                                ? "ring-brand-700 scale-110"
                                                : "ring-transparent hover:scale-105"
                                        )}
                                        onClick={() => setValue("color", premadeColor)}
                                    ></button>
                                ))}
                            </div>

                            {errors.color ? (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.color.message}
                                </p>
                            ) : null}
                        </div>
                        <div>
                            <Label>Emoji</Label>
                            <div className="flex flex-wrap gap-3">
                                {EMOJI_OPTIONS.map(({ emoji, label }) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        className={cn(
                                            "size-10 flex items-center justify-center text-xl rounded-md transition-all",
                                            selectedEmoji === emoji
                                                ? "bg-brand-100 ring-2 ring-brand-700 scale-110"
                                                : "bg-brand-100 hover:bg-brand-200"
                                        )}
                                        onClick={() => setValue("emoji", emoji)}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>

                            {errors.emoji ? (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.emoji.message}
                                </p>
                            ) : null}
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </Button>

                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Creating..." : "Create Category"}
                            </Button>
                        </div>

                    </div>
                </form>
            </Modal>
        </>
    )
}

export default CreateCategoryModal