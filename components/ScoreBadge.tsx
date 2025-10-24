
import React from 'react';
import { ReliabilityRating } from '../types';
import { RELIABILITY_RATING_CONFIG } from '../constants';
import { ShieldExclamationIcon, ExclamationTriangleIcon, QuestionMarkCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

interface ScoreBadgeProps {
  rating: ReliabilityRating;
}

const iconMap: { [key: string]: React.ElementType } = {
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
};


const ScoreBadge: React.FC<ScoreBadgeProps> = ({ rating }) => {
  const config = RELIABILITY_RATING_CONFIG[rating] || RELIABILITY_RATING_CONFIG[ReliabilityRating.UNKNOWN];
  const IconComponent = config.icon ? iconMap[config.icon] : QuestionMarkCircleIcon;

  return (
    <div className={`p-4 rounded-lg border-2 ${config.color} flex items-center shadow-lg`}>
      <IconComponent className={`h-8 w-8 mr-3 ${config.color.split(' ')[0]}`} />
      <div>
        <h3 className={`text-xl font-semibold ${config.color.split(' ')[0]}`}>{config.text}</h3>
        <p className="text-sm text-gray-300">AIによる信頼性評価</p>
      </div>
    </div>
  );
};

export default ScoreBadge;
