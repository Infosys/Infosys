// DraftPage.tsx
// Property Form Drafts page
// Displays draft property applications and provides navigation back to previous page
// Features:
//   - Loads draft data from backend (fetchData)
//   - Shows tabs for Calendar, Map, and filter options (All, New, Reviewed, Drafts)
//   - Uses custom Layout component for consistent UI
//   - Handles back navigation via prop or browser history
// Used in: Property form workflow for managing and viewing drafts

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/DraftPage.css';
import Layout from '../../features/Agent/components/Layout';
import { fetchData } from '../../../services/dataService';
import type { DatabaseData } from '../../../services/dataService';

// DraftPageProps: props for optional propertyId and custom back handler
interface DraftPageProps {
  propertyId?: string;
  onBack?: () => void;
}

const DraftPage: React.FC<DraftPageProps> = ({ onBack }) => {
  // Navigation and local state for fetched data
  const navigate = useNavigate();
  const [, setData] = useState<DatabaseData | null>(null);

  useEffect(() => {
    // Load draft data from backend
    const loadData = async () => {
      try {
        const fetchedData = await fetchData();
        setData(fetchedData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const handleBack = () => {
    // Handles back navigation via prop or browser history
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    // Layout with header and navigation hidden
    <Layout
      activeTab="home"
      onTabChange={() => {}} // No tab change needed on draft page
      showHeader={false}
      showNavigation={false}
      headerProps={{
        title: 'Drafts',
        showBackButton: true,
        onBack: handleBack,
        showLanguage: false,
        showProfile: false,
      }}
    >
      <div className="draft-page">
        {/* Tabs */}
        <div className="draft-tabs">
          <button className="tab-button active">Calendar</button>
          <button className="tab-button">Map</button>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button className="filter-tab">All</button>
          <button className="filter-tab">New</button>
          <button className="filter-tab">Reviewed</button>
          <button className="filter-tab active">Drafts</button>
        </div>
      </div>
    </Layout>
  );
};

export default DraftPage;
