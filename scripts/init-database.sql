-- SureGuard AI Database Schema
-- Version: 1.0
-- Created: 2025-01-18

-- Create database
CREATE DATABASE IF NOT EXISTS sureguard_ai;
USE sureguard_ai;

-- Users table for authentication and role management
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'analyst', 'developer') DEFAULT 'developer',
    status ENUM('active', 'suspended', 'pending') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(32) NULL
);

-- API keys table for managing API access
CREATE TABLE api_keys (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    status ENUM('active', 'revoked', 'expired') DEFAULT 'active',
    permissions JSON NOT NULL,
    rate_limit_per_hour INT DEFAULT 1000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    last_used TIMESTAMP NULL,
    usage_count INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_key_hash (key_hash),
    INDEX idx_user_id (user_id)
);

-- Threat detections table for storing AI analysis results
CREATE TABLE threat_detections (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    input_value VARCHAR(500) NOT NULL,
    input_type ENUM('ip', 'email', 'device', 'domain') NOT NULL,
    risk_score INT NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    confidence_score INT NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
    threat_type VARCHAR(100) NOT NULL,
    status ENUM('active', 'resolved', 'investigating', 'false_positive') DEFAULT 'active',
    severity ENUM('critical', 'high', 'medium', 'low') NOT NULL,
    location_country VARCHAR(100),
    location_city VARCHAR(100),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    device_fingerprint JSON,
    session_data JSON,
    ai_analysis JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    resolved_by VARCHAR(36) NULL,
    FOREIGN KEY (resolved_by) REFERENCES users(id),
    INDEX idx_input_value (input_value),
    INDEX idx_risk_score (risk_score),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Device fingerprints table for tracking unique devices
CREATE TABLE device_fingerprints (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    fingerprint_hash VARCHAR(64) UNIQUE NOT NULL,
    user_agent TEXT,
    screen_resolution VARCHAR(20),
    timezone VARCHAR(50),
    language VARCHAR(10),
    platform VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    device_type ENUM('desktop', 'mobile', 'tablet') NOT NULL,
    is_suspicious BOOLEAN DEFAULT FALSE,
    first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    seen_count INT DEFAULT 1,
    associated_ips JSON,
    risk_factors JSON,
    INDEX idx_fingerprint_hash (fingerprint_hash),
    INDEX idx_last_seen (last_seen)
);

-- IP addresses table for tracking IP reputation and geolocation
CREATE TABLE ip_addresses (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    ip_address VARCHAR(45) UNIQUE NOT NULL,
    ip_type ENUM('ipv4', 'ipv6') NOT NULL,
    country VARCHAR(100),
    city VARCHAR(100),
    region VARCHAR(100),
    isp VARCHAR(200),
    organization VARCHAR(200),
    is_vpn BOOLEAN DEFAULT FALSE,
    is_proxy BOOLEAN DEFAULT FALSE,
    is_tor BOOLEAN DEFAULT FALSE,
    is_malicious BOOLEAN DEFAULT FALSE,
    reputation_score INT DEFAULT 50 CHECK (reputation_score >= 0 AND reputation_score <= 100),
    first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    threat_count INT DEFAULT 0,
    whitelist_status BOOLEAN DEFAULT FALSE,
    blacklist_status BOOLEAN DEFAULT FALSE,
    INDEX idx_ip_address (ip_address),
    INDEX idx_reputation_score (reputation_score),
    INDEX idx_is_malicious (is_malicious)
);

-- Sessions table for tracking user sessions and behavior
CREATE TABLE user_sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    session_id VARCHAR(128) UNIQUE NOT NULL,
    user_identifier VARCHAR(255), -- Could be email, user ID, or anonymous identifier
    ip_address VARCHAR(45) NOT NULL,
    device_fingerprint_id VARCHAR(36),
    user_agent TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    duration_seconds INT,
    page_views INT DEFAULT 0,
    actions_performed JSON,
    risk_events JSON,
    is_suspicious BOOLEAN DEFAULT FALSE,
    geolocation JSON,
    FOREIGN KEY (device_fingerprint_id) REFERENCES device_fingerprints(id),
    INDEX idx_session_id (session_id),
    INDEX idx_ip_address (ip_address),
    INDEX idx_started_at (started_at),
    INDEX idx_is_suspicious (is_suspicious)
);

-- Alerts table for managing security alerts and notifications
CREATE TABLE security_alerts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    alert_type VARCHAR(100) NOT NULL,
    severity ENUM('critical', 'high', 'medium', 'low') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    source_type ENUM('threat_detection', 'api_abuse', 'user_behavior', 'system') NOT NULL,
    source_id VARCHAR(36),
    affected_resource VARCHAR(255),
    status ENUM('open', 'investigating', 'resolved', 'false_positive') DEFAULT 'open',
    assigned_to VARCHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    resolution_notes TEXT,
    metadata JSON,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    INDEX idx_severity (severity),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_alert_type (alert_type)
);

-- API usage logs for monitoring and analytics
CREATE TABLE api_usage_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    api_key_id VARCHAR(36) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    method ENUM('GET', 'POST', 'PUT', 'DELETE', 'PATCH') NOT NULL,
    request_ip VARCHAR(45) NOT NULL,
    user_agent TEXT,
    request_size INT,
    response_size INT,
    response_status INT NOT NULL,
    response_time_ms INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    request_data JSON,
    response_data JSON,
    error_message TEXT,
    FOREIGN KEY (api_key_id) REFERENCES api_keys(id) ON DELETE CASCADE,
    INDEX idx_api_key_id (api_key_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_endpoint (endpoint),
    INDEX idx_response_status (response_status)
);

-- Audit logs for tracking administrative actions
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(36),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_action (action),
    INDEX idx_resource_type (resource_type)
);

-- Webhooks table for managing webhook configurations
CREATE TABLE webhooks (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    events JSON NOT NULL, -- Array of event types to listen for
    secret VARCHAR(255), -- For webhook signature verification
    status ENUM('active', 'inactive', 'failed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_triggered TIMESTAMP NULL,
    success_count INT DEFAULT 0,
    failure_count INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);

-- Webhook delivery logs
CREATE TABLE webhook_deliveries (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    webhook_id VARCHAR(36) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSON NOT NULL,
    response_status INT,
    response_body TEXT,
    delivery_time_ms INT,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    retry_count INT DEFAULT 0,
    FOREIGN KEY (webhook_id) REFERENCES webhooks(id) ON DELETE CASCADE,
    INDEX idx_webhook_id (webhook_id),
    INDEX idx_attempted_at (attempted_at),
    INDEX idx_success (success)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_threat_detections_composite ON threat_detections(status, severity, created_at);
CREATE INDEX idx_sessions_composite ON user_sessions(ip_address, started_at);
CREATE INDEX idx_api_logs_composite ON api_usage_logs(api_key_id, timestamp);

-- Insert default admin user (password should be hashed in real implementation)
INSERT INTO users (username, email, password_hash, role, status) VALUES 
('admin', 'admin@sureguard.ai', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'admin', 'active');

-- Insert sample data for development
INSERT INTO threat_detections (input_value, input_type, risk_score, confidence_score, threat_type, severity, location_country, location_city) VALUES
('192.168.1.100', 'ip', 90, 85, 'Carding', 'critical', 'Unknown', 'Unknown'),
('suspicious@example.com', 'email', 80, 90, 'Account takeover', 'high', 'United States', 'New York'),
('device_12345', 'device', 70, 75, 'Identity theft', 'medium', 'United Kingdom', 'London'),
('malicious.com', 'domain', 60, 80, 'Phishing', 'medium', 'Japan', 'Tokyo'),
('10.0.0.1', 'ip', 50, 70, 'Malware', 'low', 'Germany', 'Berlin');
