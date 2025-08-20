import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { Building2, Store, Users } from 'lucide-react';

const TabsSection = ({ activeTab, setActiveTab, tabs }) => {
  const iconMap = { Building2, Store, Users };

  return (
    <Tabs
      value={activeTab}
      onChange={(e, newValue) => setActiveTab(newValue)}
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        mb: 3,
        '& .MuiTab-root': {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          py: 2,
        },
        '& .Mui-selected': { color: 'primary.main' },
        '& .MuiTabs-indicator': { bgcolor: 'primary.main' },
      }}
    >
      {tabs.map((tab) => {
        const Icon = iconMap[tab.icon];
        return (
          <Tab
            key={tab.id}
            value={tab.id}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon size={20} />
                {tab.label}
                <Box
                  sx={{
                    ml: 1,
                    px: 1,
                    py: 0.25,
                    bgcolor: 'grey.100',
                    color: 'text.secondary',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                  }}
                >
                  {tab.count}
                </Box>
              </Box>
            }
          />
        );
      })}
    </Tabs>
  );
};

export default TabsSection;