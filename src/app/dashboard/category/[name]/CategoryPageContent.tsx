"use client"

import { EventCategory } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { EmptyCategoryState } from "./EmptyCategoryState"

interface CategoryPageContentProps {
    hasEvent: boolean
    category: EventCategory
}

export const CategoryPageContent = ({
    hasEvent: initialHasEvent,
    category
}: CategoryPageContentProps) => {
    const { data: pollingData } = useQuery({
        queryKey: ["category", category.name, "hasEvent"],
        initialData: {
            hasEvent: initialHasEvent
        }
    })

    if (!pollingData.hasEvent) {
        return <EmptyCategoryState categoryName={category.name} />
    }
}