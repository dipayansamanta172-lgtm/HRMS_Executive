import React from 'react';
import { 
  UserPlus, 
  BadgeCheck, 
  Asterisk, 
  ChevronRight, 
  LogIn, 
  Receipt 
} from 'lucide-react';
import styles from './RecentActivityList.module.css';

export const RecentActivityList = ({ 
  title = "Recent Activity", 
  activities = [], 
  interactive = false,
  onItemClick,
  onViewAll
}) => {
  
  const getActivityIcon = (type, severity = 'info') => {
    let icon = Asterisk;
    const severityCap = severity.charAt(0).toUpperCase() + severity.slice(1);
    let className = styles[`badge${severityCap}`] || styles.badgeInfo;

    switch (type) {
      case 'new_hire':
        icon = UserPlus;
        break;
      case 'payroll_approval':
      case 'leave_approve':
        icon = BadgeCheck;
        break;
      case 'leave_request':
        icon = Asterisk;
        break;
      case 'check_in':
        icon = LogIn;
        break;
      case 'payroll':
        icon = Receipt;
        break;
      default:
        icon = Asterisk;
        break;
    }
    return { icon, class: className };
  };

  return (
    <div className={styles.activityContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {onViewAll && (
          <button className={styles.viewAll} onClick={onViewAll}>View All</button>
        )}
      </div>
      
      <div className={styles.list}>
        {activities.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '32px 16px', 
            color: 'var(--text-muted)', 
            fontWeight: 600,
            fontSize: '0.85rem'
          }}>
            No recent activity.
          </div>
        ) : (
          activities.map((act) => {
            const config = getActivityIcon(act.type, act.severity);
            const Icon = config.icon;
            
            return (
              <div 
                key={act.id} 
                className={`${styles.item} ${interactive ? styles.interactiveItem : ''}`}
                onClick={() => interactive && onItemClick && onItemClick(act)}
              >
                <div className={styles.leftSection}>
                  <div className={`${styles.avatarWrapper} ${config.class}`}>
                    {act.userPhoto ? (
                      <img src={act.userPhoto} alt="" className={styles.avatar} />
                    ) : (
                      <Icon size={18} />
                    )}
                  </div>
                  
                  <div className={styles.textSection}>
                    <span className={styles.itemTitle}>{act.title}</span>
                    <span className={styles.itemTime}>{act.time}</span>
                  </div>
                </div>
                
                {interactive && (
                  <ChevronRight className={styles.chevron} size={18} />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentActivityList;
