-- Complete database schema for SureGuard AI

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom types
CREATE TYPE user_role AS ENUM ('admin', 'analyst', 'developer', 'viewer');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'pending', 'suspended');
CREATE TYPE threat_input_type AS ENUM ('ip', 'url', 'email', 'domain', 'hash', 'file');
CREATE TYPE threat_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE threat_status AS ENUM ('active', 'resolved', 'investigating', 'false_positive');
CREATE TYPE api_key_status AS ENUM ('active', 'inactive', 'revoked');
CREATE TYPE notification_type AS ENUM ('email', 'slack', 'webhook', 'sms', 'teams');
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'failed', 'delivered');
CREATE TYPE integration_type AS ENUM ('siem', 'soar', 'ticketing', 'messaging', 'custom');
CREATE TYPE integration_status AS ENUM ('active', 'inactive', 'error', 'configuring');

-- Organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    subscription_tier VARCHAR(50) DEFAULT 'starter',
    subscription_status VARCHAR(50) DEFAULT 'active',
    api_quota_monthly INTEGER DEFAULT 10000,
    api_usage_current INTEGER DEFAULT 0,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'developer',
    status user_status NOT NULL DEFAULT 'pending',
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(32),
    avatar_url VARCHAR(500),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP
);

-- API Keys table
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    key_prefix VARCHAR(20) NOT NULL,
    status api_key_status DEFAULT 'active',
    permissions JSONB NOT NULL DEFAULT '[]',
    rate_limit_per_hour INTEGER DEFAULT 1000,
    rate_limit_per_day INTEGER DEFAULT 10000,
    allowed_ips INET[],
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    last_used TIMESTAMP,
    usage_count INTEGER DEFAULT 0
);

-- Threat Detections table
CREATE TABLE threat_detections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
    input_value VARCHAR(2000) NOT NULL,
    input_type threat_input_type NOT NULL,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
    threat_type VARCHAR(100) NOT NULL,
    severity threat_severity NOT NULL,
    status threat_status DEFAULT 'active',
    location_country VARCHAR(100),
    location_city VARCHAR(100),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    ai_analysis JSONB,
    device_fingerprint JSONB,
    session_data JSONB,
    threat_intelligence JSONB,
    processing_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES users(id)
);

-- Threat Intelligence Sources table
CREATE TABLE threat_intelligence_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    url VARCHAR(500),
    api_key_encrypted TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP,
    update_frequency_hours INTEGER DEFAULT 24,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Threat Intelligence Feeds table
CREATE TABLE threat_intelligence_feeds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES threat_intelligence_sources(id) ON DELETE CASCADE,
    indicator_value VARCHAR(500) NOT NULL,
    indicator_type threat_input_type NOT NULL,
    threat_type VARCHAR(100),
    confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
    severity threat_severity,
    description TEXT,
    tags TEXT[],
    first_seen TIMESTAMP,
    last_seen TIMESTAMP,
    expires_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ML Models table
CREATE TABLE ml_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    model_type VARCHAR(50) NOT NULL,
    file_path VARCHAR(500),
    accuracy DECIMAL(5,4),
    precision_score DECIMAL(5,4),
    recall DECIMAL(5,4),
    f1_score DECIMAL(5,4),
    training_data_size INTEGER,
    is_active BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    trained_at TIMESTAMP,
    deployed_at TIMESTAMP
);

-- Model Performance Metrics table
CREATE TABLE model_performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID NOT NULL REFERENCES ml_models(id) ON DELETE CASCADE,
    metric_name VARCHAR(50) NOT NULL,
    metric_value DECIMAL(10,6) NOT NULL,
    recorded_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    threat_detection_id UUID REFERENCES threat_detections(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status notification_status DEFAULT 'pending',
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notification Templates table
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type notification_type NOT NULL,
    trigger_conditions JSONB NOT NULL,
    subject_template VARCHAR(255),
    message_template TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Integrations table
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type integration_type NOT NULL,
    status integration_status DEFAULT 'configuring',
    endpoint_url VARCHAR(500),
    auth_config JSONB,
    settings JSONB DEFAULT '{}',
    last_sync TIMESTAMP,
    sync_frequency_minutes INTEGER DEFAULT 60,
    error_count INTEGER DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Integration Logs table
CREATE TABLE integration_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    integration_id UUID NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    request_data JSONB,
    response_data JSONB,
    error_message TEXT,
    duration_ms INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    format VARCHAR(20) NOT NULL,
    parameters JSONB,
    file_path VARCHAR(500),
    file_size INTEGER,
    status VARCHAR(20) DEFAULT 'generating',
    generated_at TIMESTAMP,
    expires_at TIMESTAMP,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Scheduled Reports table
CREATE TABLE scheduled_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    parameters JSONB,
    schedule_cron VARCHAR(100) NOT NULL,
    recipients TEXT[] NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_run TIMESTAMP,
    next_run TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Audit Logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- System Settings table
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- API Usage Metrics table
CREATE TABLE api_usage_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER,
    request_size INTEGER,
    response_size INTEGER,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Webhooks table
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    secret VARCHAR(255),
    events TEXT[] NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    retry_count INTEGER DEFAULT 3,
    timeout_seconds INTEGER DEFAULT 30,
    last_triggered TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Webhook Deliveries table
CREATE TABLE webhook_deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    http_status INTEGER,
    response_body TEXT,
    attempt_count INTEGER DEFAULT 0,
    next_retry TIMESTAMP,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_organization_id ON api_keys(organization_id);
CREATE INDEX idx_threat_detections_created_at ON threat_detections(created_at);
CREATE INDEX idx_threat_detections_organization_id ON threat_detections(organization_id);
CREATE INDEX idx_threat_detections_severity ON threat_detections(severity);
CREATE INDEX idx_threat_detections_status ON threat_detections(status);
CREATE INDEX idx_threat_detections_risk_score ON threat_detections(risk_score);
CREATE INDEX idx_threat_detections_input_type ON threat_detections(input_type);
CREATE INDEX idx_threat_detections_input_value ON threat_detections(input_value);
CREATE INDEX idx_threat_intelligence_feeds_indicator_value ON threat_intelligence_feeds(indicator_value);
CREATE INDEX idx_threat_intelligence_feeds_indicator_type ON threat_intelligence_feeds(indicator_type);
CREATE INDEX idx_threat_intelligence_feeds_expires_at ON threat_intelligence_feeds(expires_at);
CREATE INDEX idx_notifications_organization_id ON notifications(organization_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_integrations_organization_id ON integrations(organization_id);
CREATE INDEX idx_integrations_type ON integrations(type);
CREATE INDEX idx_audit_logs_organization_id ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_api_usage_metrics_organization_id ON api_usage_metrics(organization_id);
CREATE INDEX idx_api_usage_metrics_created_at ON api_usage_metrics(created_at);

-- Composite indexes
CREATE INDEX idx_threat_detections_org_created ON threat_detections(organization_id, created_at);
CREATE INDEX idx_threat_detections_org_severity ON threat_detections(organization_id, severity);
CREATE INDEX idx_api_usage_metrics_org_created ON api_usage_metrics(organization_id, created_at);

-- Full-text search indexes
CREATE INDEX idx_threat_detections_input_value_gin ON threat_detections USING gin(to_tsvector('english', input_value));

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_threat_detections_updated_at BEFORE UPDATE ON threat_detections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_threat_intelligence_feeds_updated_at BEFORE UPDATE ON threat_intelligence_feeds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_templates_updated_at BEFORE UPDATE ON notification_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scheduled_reports_updated_at BEFORE UPDATE ON scheduled_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
('max_api_requests_per_hour', '10000', 'Maximum API requests per hour per organization'),
('default_threat_retention_days', '90', 'Default retention period for threat data in days'),
('ml_model_update_frequency_hours', '24', 'Frequency of ML model updates in hours'),
('notification_retry_attempts', '3', 'Number of retry attempts for failed notifications'),
('webhook_timeout_seconds', '30', 'Timeout for webhook deliveries in seconds'),
('report_retention_days', '30', 'Retention period for generated reports in days'),
('audit_log_retention_days', '365', 'Retention period for audit logs in days'),
('api_rate_limit_window_minutes', '15', 'Rate limiting window in minutes'),
('max_batch_analysis_size', '100', 'Maximum number of items in batch analysis'),
('threat_intelligence_update_frequency_hours', '6', 'Frequency of threat intelligence updates in hours');

-- Insert default threat intelligence sources
INSERT INTO threat_intelligence_sources (name, type, url, is_active) VALUES
('VirusTotal', 'commercial', 'https://www.virustotal.com/vtapi/v2/', true),
('AbuseIPDB', 'commercial', 'https://api.abuseipdb.com/api/v2/', true),
('Shodan', 'commercial', 'https://api.shodan.io/', true),
('AlienVault OTX', 'free', 'https://otx.alienvault.com/api/v1/', true),
('Malware Domain List', 'free', 'http://www.malwaredomainlist.com/', true),
('Spamhaus', 'free', 'https://www.spamhaus.org/', true),
('SANS ISC', 'free', 'https://isc.sans.edu/', true),
('Emerging Threats', 'free', 'https://rules.emergingthreats.net/', true);

-- Insert default ML models
INSERT INTO ml_models (name, version, model_type, is_active, accuracy, precision_score, recall, f1_score) VALUES
('IP Reputation Classifier', '1.0.0', 'random_forest', true, 0.9750, 0.9680, 0.9820, 0.9749),
('URL Threat Detector', '1.0.0', 'random_forest', true, 0.9420, 0.9380, 0.9460, 0.9420),
('Device Fingerprint Analyzer', '1.0.0', 'neural_network', true, 0.9340, 0.9290, 0.9390, 0.9339),
('Behavioral Anomaly Detector', '1.0.0', 'lstm', true, 0.9110, 0.9050, 0.9170, 0.9109),
('General Anomaly Detector', '1.0.0', 'isolation_forest', true, 0.8830, 0.8780, 0.8880, 0.8829);

-- Insert default notification templates
INSERT INTO notification_templates (name, type, trigger_conditions, subject_template, message_template, is_active) VALUES
('Critical Threat Alert', 'email', '{"severity": "critical"}', 'CRITICAL: Threat Detected - {{threat_type}}', 'A critical threat has been detected:\n\nThreat Type: {{threat_type}}\nRisk Score: {{risk_score}}\nInput: {{input_value}}\nLocation: {{location}}\n\nImmediate action required.', true),
('High Risk Notification', 'slack', '{"severity": "high", "risk_score": {"$gte": 70}}', null, ':warning: High risk threat detected: {{threat_type}} (Risk: {{risk_score}}) - {{input_value}}', true),
('Daily Threat Summary', 'email', '{"schedule": "daily"}', 'Daily Threat Summary - {{date}}', 'Daily threat summary for {{date}}:\n\nTotal Threats: {{total_threats}}\nCritical: {{critical_count}}\nHigh: {{high_count}}\nMedium: {{medium_count}}\nLow: {{low_count}}', true);

-- Create views for common queries
CREATE VIEW threat_summary AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_threats,
    COUNT(*) FILTER (WHERE severity = 'critical') as critical_threats,
    COUNT(*) FILTER (WHERE severity = 'high') as high_threats,
    COUNT(*) FILTER (WHERE severity = 'medium') as medium_threats,
    COUNT(*) FILTER (WHERE severity = 'low') as low_threats,
    AVG(risk_score) as avg_risk_score,
    AVG(processing_time_ms) as avg_processing_time
FROM threat_detections
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE VIEW organization_usage AS
SELECT 
    o.id,
    o.name,
    o.subscription_tier,
    COUNT(td.id) as total_threats,
    COUNT(ak.id) as total_api_keys,
    SUM(ak.usage_count) as total_api_calls,
    o.api_quota_monthly,
    o.api_usage_current
FROM organizations o
LEFT JOIN threat_detections td ON o.id = td.organization_id
LEFT JOIN api_keys ak ON o.id = ak.organization_id
GROUP BY o.id, o.name, o.subscription_tier, o.api_quota_monthly, o.api_usage_current;

-- Row Level Security (RLS) policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE threat_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (would be customized based on authentication system)
-- CREATE POLICY org_isolation ON threat_detections FOR ALL TO authenticated_users USING (organization_id = current_setting('app.current_organization_id')::uuid);

-- Data retention policies (using pg_cron extension if available)
-- SELECT cron.schedule('cleanup-old-threats', '0 2 * * *', 'DELETE FROM threat_detections WHERE created_at < NOW() - INTERVAL ''90 days'' AND status = ''resolved'';');
-- SELECT cron.schedule('cleanup-old-audit-logs', '0 3 * * *', 'DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL ''365 days'';');
-- SELECT cron.schedule('cleanup-old-api-metrics', '0 4 * * *', 'DELETE FROM api_usage_metrics WHERE created_at < NOW() - INTERVAL ''30 days'';');

COMMIT;
