import { useQuery } from '@tanstack/react-query'
import React from 'react'

const DashboardPageContent = () => {
  const { } = useQuery({
    queryKey: ['user-event-categories'],
    queryFn: async () => {
      
    }
  });
  return (
    <div>

    </div>
  )
}

export default DashboardPageContent
